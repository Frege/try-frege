package tryfrege.web;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.Collections;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.script.SimpleScriptContext;
import javax.script.ScriptContext;

import frege.scriptengine.FregeScriptEngine;
import frege.memoryjavac.MemoryClassLoader;

import frege.prelude.PreludeBase.TEither;
import frege.prelude.PreludeBase.TList;
import frege.prelude.PreludeBase.TList.DCons;
import frege.prelude.PreludeBase.TMaybe;
import frege.runtime.Func1;
import frege.runtime.Lazy;
import frege.runtime.Delayed;

public class ContextListener implements ServletContextListener {

    private static final String modulePrelude = "import frege.Prelude hiding " +
        "(stdout, stderr, print, println, trace, traceLn, printStr, printStrLn, traceStr, traceStrLn)\n" +
        "import scripting.PreludeScripting";

    @Override
    public void contextDestroyed(final ServletContextEvent arg0) {

    }

    @Override
    public void contextInitialized(final ServletContextEvent event) {
        final ServletContext context = event.getServletContext();
        context.setAttribute("preludeScripts", preludeScripts(context));
        evalPrelude(preludeScripts(context).get(0), context);
    }

    public void evalPrelude(final String prelude, 
                            final ServletContext context) {
        final SimpleScriptContext scontext = new SimpleScriptContext();
        scontext.setAttribute("modulePrelude", modulePrelude, ScriptContext.ENGINE_SCOPE);
        final Func1 io = (Func1) FregeScriptEngine.load(prelude,
                                                        scontext);
        final TEither intpRes = io.apply(1).result().<TEither>forced();
        final int cons = intpRes._constructor();
        if (cons == 0) {
            final TList errs = getLeft(intpRes);
            final List<String> errMsgs = toJavaList(errs);
            throw new RuntimeException(errMsgs.toString());
        } else {
            final Object right = getRight(intpRes);
            final MemoryClassLoader loader = (MemoryClassLoader) right;
            context.setAttribute("classes", loader.getClasses());
        }
    }

    public static <A> A getLeft(final TEither either) {
        final TEither.DLeft left = (TEither.DLeft) either._Left().call();
        final A result;
        if (left.mem1 instanceof Lazy) {
            result = ((Lazy) left.mem1).forced();
        } else {
            result = (A) left.mem1;
        }
        return result;
    }

    public static <A> A getRightMaybe(final TEither either) {
        final TEither.DRight right = (TEither.DRight) either._Right().call();
        final A result;
        if (right.mem1 instanceof Lazy) {
            final TMaybe valueMaybe = ((Lazy) right.mem1).<TMaybe> forced();
            result = toJavaValue(valueMaybe);
        } else {
            result = toJavaValue((TMaybe) right.mem1);
        }
        return result;
    }

    public static <A> A getRight(final TEither either) {
        final TEither.DRight right = (TEither.DRight) either._Right().call();
        final A result;
        if (right.mem1 instanceof Lazy) {
            result = ((Lazy) right.mem1).forced();
        } else {
            result = (A) right.mem1;
        }
        return result;
    }

    private static <A> A toJavaValue(final TMaybe valueMaybe) {
        final A result;
        if (valueMaybe._constructor() == 0) {
            result = null;
        } else {
            result = (A) valueMaybe._Just().mem1;
        }
        return result;
    }

    private static <A> List<A> toJavaListLoop(final TList list,
                                              final List<A> acc) {
        if (list._constructor() == 0) { // Nil
            return acc;
        } else {
            final DCons cons = list._Cons();
            final A elem;
            if (cons.mem1 instanceof Lazy) {
                elem = ((Lazy) cons.mem1).<A> forced();
            } else {
                elem = (A) cons.mem1;
            }
            acc.add(elem);
            return toJavaListLoop((TList) cons.mem2.forced(), acc);
        }
    }

    public static <A> List<A> toJavaList(final TList list) {
        final List<A> jlist = toJavaListLoop(list, new ArrayList<A>());
        return Collections.unmodifiableList(jlist);
    }


    private List<String> preludeScripts(final ServletContext context) {
        final InputStream ioScriptStream = context
            .getResourceAsStream("/WEB-INF/fregescripts/PreludeScripting.fr");
        try (Scanner scanner = new Scanner(ioScriptStream)) {
                final String preludeScript = scanner.useDelimiter("\\Z").next();
                return Arrays.asList(preludeScript);
            }

    }

}
