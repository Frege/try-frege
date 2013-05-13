package tryfrege.web;

import java.io.IOException;

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
	}
}
