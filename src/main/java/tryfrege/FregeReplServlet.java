package tryfrege;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import frege.script.JFregeInterpreter;
import frege.script.JInterpreterResult;

/**
 * Evaluates Frege code and returns the result.
 *
 */
public class FregeReplServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	@Override
	public void init() throws ServletException {
		try {
			JFregeInterpreter.interpret("\"a\"", ""); //warmup request
		} catch (final Exception e) {
		}
	}

	@Override
	protected void doPost(final HttpServletRequest request,
			final HttpServletResponse response) throws ServletException,
			IOException {
		final String script = request.getParameter("snippet");
		final String history = request.getParameter("history");
		ReplResponse replResponse;
		if (script == null || script.isEmpty()) {
			replResponse =  new ReplResponse("Invalid Script!",
					MessageType.INFO);
		} else {
			try {
				final JInterpreterResult scriptResult = 
						JFregeInterpreter.interpret(script, history);
				replResponse = new ReplResponse(scriptResult.getValue(), 
						MessageType.SUCCESS);
				request.setAttribute("history", scriptResult.getScript());
			} catch (final Exception e) {
				replResponse = new ReplResponse(getRootCause(e).getMessage(),
						MessageType.ERROR);
			}
		}
		request.setAttribute("result", replResponse);
		final RequestDispatcher dispatcher = 
				request.getRequestDispatcher(request.getContextPath() + 
						"/WEB-INF/pages/replResponse.jsp");
		dispatcher.forward(request, response);
	}

	/**
	 * Utility to return the exception root cause. Recursive causes are not 
	 * handled.
	 * @param e
	 * @return the root cause
	 */
	private Throwable getRootCause(final Throwable e) {
		return e.getCause() == null ? e : getRootCause(e.getCause());
	}

}
