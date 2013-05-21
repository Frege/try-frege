package tryfrege.web;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import frege.runtime.Func1;

import tryfrege.repl.FregeReplServlet;

/**
 * Evaluates Frege code and returns the result.
 *
 */
public class FregeReplController extends HttpServlet {
	private static final long serialVersionUID = 1L;


	@Override
	protected void doPost(final HttpServletRequest request,
			final HttpServletResponse response) throws ServletException,
			IOException {
		final Func1 scriptResultIO = (Func1) FregeReplServlet.doPost(this, request, response);
		scriptResultIO.apply(1).forced();
		HttpURLConnection connection = null;
		try {
			connection =
					(HttpURLConnection) new URL("http://localhost:9080/tryfrege/run").openConnection();
			connection.connect();
		} catch (final Exception e) {
			new Thread(new Runnable() {
				@Override
				public void run() {
					startReplRunner(response);
				}
			}).start();
		} finally {
			if (connection != null) {
				connection.disconnect();
			}
		}
	}

	private static void startReplRunner(final HttpServletResponse response) {
		final ProcessBuilder pb = new ProcessBuilder("java",
				"-jar",
				"/usr/share/tryfrege/jetty-runner-8.1.9.v20130131.jar",
				"--port",
				"9080",
				"--path",
				"tryfrege",
				"/usr/share/tryfrege/tryfrege.war");
		pb.redirectErrorStream(true);
		try {
			pb.start();
		} catch (final IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	protected void doGet(final HttpServletRequest request,
			final HttpServletResponse response) throws ServletException,
			IOException {
		doPost(request, response);
	}
}
