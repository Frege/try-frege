package tryfrege.jdeps;

import java.io.FilePermission;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.Permission;
import java.util.Timer;
import java.util.TimerTask;

import javax.script.ScriptException;

import frege.runtime.Delayed;

public class Sandbox {

    public static Object secureFetchFieldValue(final String className,
                                               final String variableName, final ClassLoader loader)
        throws ScriptException {
        final Timer timer = new Timer("terminator");
        final ReplSecurityManager sm = new ReplSecurityManager();
        final SecuredThread runner = new SecuredThread(className, variableName,
                                                       loader, timer, sm);
        runner.start();
        try {
            runner.join(1000 * 8);
        } catch (final InterruptedException e) {
        }
        sm.setDisabled(true);
        if (runner.getResult() != null) {
            if (runner.getResult() instanceof Throwable) {
                final Throwable e = (Throwable) runner.getResult();
                throw new ScriptException(
                                          e.getCause() != null ? e.getCause().toString() : e.toString());
            } else {
                return runner.getResult();
            }
        } else {
            throw new ScriptException(
                                      "Timed out or Access Denied! Restarting REPL...");
        }
    }

    static class ReplSecurityManager extends SecurityManager {
        private boolean isDisabled;

        public ReplSecurityManager() {
            isDisabled = false;
        }

        @Override
        public void checkPermission(final Permission perm) {
            if (isDisabled)
                return;
            if (Thread.currentThread().getName().equals("terminator"))
                return;
            if (perm instanceof RuntimePermission) {
                final RuntimePermission runtimePerm = (RuntimePermission) perm;
                if (runtimePerm.getName().equals("accessDeclaredMembers")) {
                    return;
                }
            } else if (perm instanceof FilePermission) {
                final String fileName = perm.getName();
                if (fileName.endsWith(".jar") || fileName.endsWith(".class") ||
                    fileName.endsWith("/tryfrege/WEB-INF/classes")) {
                    return;
                }
            }
            super.checkPermission(perm);
        }

        public void setDisabled(final boolean isDisabled) {
            this.isDisabled = isDisabled;
        }

    }

    private static class SecuredThread extends Thread {
        final String className;
        final String variableName;
        final ClassLoader loader;
        final ReplSecurityManager sm;
        final Timer terminator;
        Object result = null;

        public SecuredThread(final String className, final String variableName,
                             final ClassLoader loader, final Timer terminator,
                             final ReplSecurityManager sm) {
            this.className = className;
            this.variableName = variableName;
            this.loader = loader;
            this.sm = sm;
            this.terminator = terminator;
        }

        @Override
        public void run() {
            final SecurityManager old = System.getSecurityManager();
            System.setSecurityManager(sm);
            /*
             * schedule JVM exit in 5 seconds in case request doesn't complete
             */
            terminator.schedule(jvmExitTask(sm), 1000 * 5);
            try {
                final Class<?> clazz = loader.loadClass(className);
                final Object value = clazz.getDeclaredField(variableName).get(null);
                result = Delayed.forced(value);
            } catch (final Throwable e) { //catch Frege runtime errors
                terminator.cancel(); // cancel JVM exit timer
                result = e.getCause() != null ? e.getCause() : e;
            }
            terminator.cancel(); // cancel JVM exit timer
            sm.setDisabled(true);
            System.setSecurityManager(old);
        }

        public Object getResult() {
            return result;
        }
    }

    private static TimerTask jvmExitTask(final ReplSecurityManager sm) {
        return new TimerTask() {
            @Override
            public void run() {
                sm.setDisabled(true);
                System.exit(-1);
            }
        };
    }

}
