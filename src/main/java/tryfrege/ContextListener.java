package tryfrege;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import frege.script.JFregeInterpreter;

public class ContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(final ServletContextEvent arg0) {
		
	}

	@Override
	public void contextInitialized(final ServletContextEvent arg0) {
		//warmupInterpreter();
	}

	public void warmupInterpreter() {
		try {
			JFregeInterpreter.interpret("1", "");
		} catch (final Exception e) {
		}
	}
	
}
