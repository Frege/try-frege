package tryfrege.web;

import frege.interpreter.FregeInterpreter;
import frege.interpreter.javasupport.InterpreterClassLoader;
import frege.prelude.PreludeBase;
import frege.runtime.Lambda;
import frege.runtime.Lazy;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class ContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(final ServletContextEvent event) {
        final ServletContext context = event.getServletContext();
        context.setAttribute("preludeScripts", preludeScripts(context));
        evalPrelude(preludeScripts(context).get(0), context);
    }

    @Override
    public void contextDestroyed(final ServletContextEvent arg0) {}

    private void evalPrelude(final String prelude, final ServletContext context) {
        final Lambda res = FregeInterpreter.interpret(prelude);
        final FregeInterpreter.TInterpreterConfig config = toJavaValue(FregeInterpreter.TInterpreterConfig._default);
        final InterpreterClassLoader classLoader =
            toJavaValue(FregeInterpreter.TInterpreterClassLoader._default);
        final PreludeBase.TTuple2 intpRes = FregeInterpreter.TInterpreter.run(
            res, config, classLoader).forced();
        context.setAttribute("classes", classes(intpRes));
    }

    private Object classes(final PreludeBase.TTuple2 tup) {
        final FregeInterpreter.TInterpreterResult interpRes = toJavaValue(tup.mem1);
        final InterpreterClassLoader classLoader = toJavaValue(tup.mem2);
        final Map<String, byte[]> classes;
        switch (interpRes._constructor()) {
            case 0: //Success
                FregeInterpreter.TInterpreterResult.DSuccess success = interpRes._Success();
                final FregeInterpreter.TSourceInfo srcinfo = toJavaValue(success.mem$sourceRepr);
                if (srcinfo._constructor() == 0) { // Module
                    classes = classLoader.classes();
                } else {
                    classes = new HashMap<>();
                }
                break;
            case 1:
                FregeInterpreter.TInterpreterResult.DFailure failure = interpRes._Failure();
                final PreludeBase.TList msgs = toJavaValue(failure.mem1);
                final String errorMsg = toJavaValue(
                    FregeInterpreter.TMessage.showMessages(FregeInterpreter.IShow_Message.it, msgs));
                System.out.println(errorMsg);
            default:
                classes = new HashMap<>();
                break;
        }
        return classes;
    }

    private List<String> preludeScripts(final ServletContext context) {
        final InputStream ioScriptStream = context
            .getResourceAsStream("/WEB-INF/fregescripts/PreludeInterpreter.fr");
        try (final Scanner scanner = new Scanner(ioScriptStream)) {
            final String preludeScript = scanner.useDelimiter("\\Z").next();
            return Arrays.asList(preludeScript);
        }

    }

    public static <A> A toJavaValue(final Object obj) {
        final A result;
        if (obj instanceof Lazy) {
            result = ((Lazy) obj).forced();
        } else {
            result = (A) obj;
        }
        return result;
    }


}
