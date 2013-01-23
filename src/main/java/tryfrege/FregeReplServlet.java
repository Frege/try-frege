package tryfrege;

import java.io.IOException;
import java.io.StringWriter;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import frege.runtime.Delayed;
import frege.runtime.Lazy;
import frege.script.JFregeInterpreter;
import frege.script.JInterpreterResult;
import frege.script.JavaUtils;

/**
 * Evaluates Frege code and returns the result.
 *
 */
public class FregeReplServlet extends HttpServlet {
  private static final long serialVersionUID = 1L;
  

  @Override
  protected void doPost(final HttpServletRequest request,
      final HttpServletResponse response) throws ServletException,
      IOException {
    final String script = request.getParameter("snippet");
    ReplResponse replResponse;
    if (script == null || script.isEmpty()) {
      replResponse =  new ReplResponse("Invalid Script!",
          MessageType.INFO);
    } else {
      try {
        final String preludeImport;
        final URLClassLoader classLoader;
        final String history = request.getParameter("history");
	if (isPreludeScriptingRequired(script + history)) {
            final List<String> preludeScripts = getPreludeScripts();
	    preludeImport = "import scripting.PreludeScripting\n";
            classLoader = JFregeInterpreter.compileScripts(
              preludeScripts, getClassLoader());
	} else {
	    preludeImport = "";
	    classLoader = getClassLoader();
        }

        final JInterpreterResult scriptResult = 
            JFregeInterpreter.interpret(script, preludeImport + history, 
              "FregeScript", classLoader);
        final String consoleOut = getScriptingConsoleOut(classLoader);
        replResponse = new ReplResponse(consoleOut + scriptResult.getValue(), 
            MessageType.SUCCESS);
        request.setAttribute("history", 
            scriptResult.getScript().substring(preludeImport.length()));
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

  private static boolean isPreludeScriptingRequired(final String script) {
      return script.contains("print") || script.contains("trace");
  }

  private List<String> getPreludeScripts() {
    return (List<String>) getServletContext().getAttribute("preludeScripts");
  }

  private String getScriptingConsoleOut(final URLClassLoader classLoader) {
    try {
      final Class<?> clazz = classLoader.loadClass("scripting.PreludeScripting");
      final StringWriter outWriter = 
        (StringWriter) clazz.getDeclaredField("stdoutWriter").get(null);
      final StringWriter errWriter = 
        (StringWriter) clazz.getDeclaredField("stderrWriter").get(null);
      final String out = outWriter.toString();
      final String err = errWriter.toString();
      final StringBuilder builder = new StringBuilder();
      if (!out.isEmpty()) {
        builder.append(out);
        if (!out.endsWith("\n")) {
          builder.append("\n");
        }
      }
      if (!err.isEmpty()) {
        builder.append(err);
        if (!err.endsWith("\n")) {
          builder.append("\n");
        }
      }
      return builder.toString();
    } catch (final Exception e) {
    }
    return "";
  }

  public static URLClassLoader getClassLoader() {
    final ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    if (classLoader instanceof URLClassLoader) {
      return (URLClassLoader) classLoader;
    } else {
      return new URLClassLoader(new URL[] {}, classLoader);
    }
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
