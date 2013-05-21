package tryfrege.web;

import java.io.BufferedInputStream;
import java.io.FilePermission;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.security.Permission;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import frege.memoryjavac.MemoryClassLoader;

public class ReplRunnerServlet extends HttpServlet {

	private static final ClassLoader parent = ReplRunnerServlet.class
			.getClassLoader();

	@Override
	protected void doPost(final HttpServletRequest request,
			final HttpServletResponse response) throws ServletException,
			IOException {
		response.setContentType("text/html;charset=utf-8");
		final ObjectInputStream ois = new ObjectInputStream(
				new BufferedInputStream(request.getInputStream()));
		final ReplSecurityManager sm = new ReplSecurityManager();

		try {
			final String className = (String) ois.readObject();
			final String variableName = (String) ois.readObject();
			final Map<String, byte[]> classes = (Map<String, byte[]>) ois
					.readObject();
			final MemoryClassLoader loader = new MemoryClassLoader(parent,
					classes);
			final Timer timer = new Timer("terminator");
			timer.schedule(new TimerTask() {
				@Override
				public void run() {
					sm.setDisabled(true);
					System.exit(-1);
				}
			}, 1000 * 10); //schedule JVM exit in 10 seconds in case request doesn't complete
			final Thread runner = new SecuredThread(sm, new Runnable() {
				@Override
				public void run() {
					try {
						final Class<?> clazz = loader.loadClass(className);
						final Object value = clazz.getDeclaredField(
								variableName).get(null);
						response.getWriter().print(value);
						timer.cancel(); //cancel JVM exit timer
					} catch (final Exception e) {
						e.printStackTrace();
						try {
							response.getWriter().print(e.getMessage());
						} catch (final IOException e1) {
							e.printStackTrace();
						}
					}
				}
			});
			runner.start();
			runner.join(1000 * 8);
			sm.setDisabled(true);
		} catch (final Exception e) { // catch all Frege exceptions
			response.getWriter().print(e.getMessage());
		}
	}

	static class ReplSecurityManager extends SecurityManager {
		private boolean isDisabled;

		public ReplSecurityManager() {
			isDisabled = false;
		}

		@Override
		public void checkPermission(final Permission perm) {
			if (perm instanceof RuntimePermission) {
				final RuntimePermission runtimePerm = (RuntimePermission) perm;
				if (runtimePerm.getName().equals("accessDeclaredMembers")) {
					return;
				}
			} else if (perm instanceof FilePermission) {
				final String fileName = perm.getName();
				//Allow jetty and frege jars
				if (fileName.endsWith(".jar") &&
						(fileName.contains("jetty") ||
							fileName.contains("frege"))) {
					return;
				}

			}
			if (!isDisabled)
				super.checkPermission(perm);
		}

		public void setDisabled(final boolean isDisabled) {
			this.isDisabled = isDisabled;
		}

	}

	static class SecuredThread extends Thread {
		private final ReplSecurityManager sm;
		private final Runnable untrustedCode;

		public SecuredThread(final ReplSecurityManager sm,
				final Runnable untrustedCode) {
			this.sm = sm;
			this.untrustedCode = untrustedCode;
		}

		@Override
		public void run() {
			final SecurityManager old = System.getSecurityManager();
			System.setSecurityManager(sm);
			untrustedCode.run();
			sm.setDisabled(true);
			System.setSecurityManager(old);
		}

	}

	@Override
	protected void doGet(final HttpServletRequest req,
			final HttpServletResponse resp) throws ServletException,
			IOException {
		doPost(req, resp);
	}

}