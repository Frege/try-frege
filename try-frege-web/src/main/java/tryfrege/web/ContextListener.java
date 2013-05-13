package tryfrege.web;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class ContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(final ServletContextEvent arg0) {
		
	}

	@Override
	public void contextInitialized(final ServletContextEvent event) {
		final ServletContext context = event.getServletContext();
		context.setAttribute("preludeScripts", preludeScripts(context));
	}
	
	private List<String> preludeScripts(final ServletContext context) {
		final InputStream ioScriptStream = context
				.getResourceAsStream("/WEB-INF/fregescripts/PreludeScripting.fr");
		try(Scanner scanner = new Scanner(ioScriptStream)) {
			final String preludeScript = scanner.useDelimiter("\\Z").next();
			return Arrays.asList(preludeScript);
		}
		
	}

}
