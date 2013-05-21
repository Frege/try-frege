<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
          "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<c:url var="replurl" value="/eval" />
<title>Frege REPL</title>
<meta name="Content-Type" content="text/html; charset=UTF-8">
<link rel="icon" type="image/png"
	href="http://code.google.com/p/frege/logo?cct=1332936855">
<script src="${pageContext.request.contextPath}/jquery-ui-1.9.0.custom/js/jquery-1.8.2.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.console.js"></script>
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/jquery-ui-1.9.0.custom/css/redmond/jquery-ui-1.9.0.custom.min.css" />
<script src="${pageContext.request.contextPath}/jquery-ui-1.9.0.custom/js/jquery-ui-1.9.0.custom.min.js"></script>
<script src="${pageContext.request.contextPath}/js/repl.js"></script>
<script src="${pageContext.request.contextPath}/js/underscore-min.js"></script>
<script src="${pageContext.request.contextPath}/js/base64.js"></script>
<script src="${pageContext.request.contextPath}/js/github.js"></script>
<script src="${pageContext.request.contextPath}/js/showdown.js"></script>
<script type="text/javascript">
  replurl = '${replurl}';
</script>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/repl.css" />
</head>
<body style="margin-left: 50px; margin-right: 50px;margin-top:15px;margin-bottom:10px;">
	<noscript>
		<p>
			<strong>Please enable JavaScript or upgrade your browser.</strong>
		</p>
	</noscript>
	<div id="tabs"
		style="position: relative;">
		<ul>
			<li><a href="#tryfrege">Try Frege</a></li>
			<li><a href="#morefrege">About Frege</a></li>
		</ul>
		<div id="tryfrege">
		<table>
		<tr>
		<td width="100%">
		<div class=" console"></div>
		</td>
		<td>
		<div class="draggable " id="tutorial" 
		  style="display:none">
                </div>
		</td>
		</tr>
		</table>
		</div>
		<div id="morefrege" style="font-family: Consolas,Inconsolata, Profont, Terminus;font-size:12px;">
		<div class="morefrege">
		<h3>What is Frege?</h3>
		<p><a target="_blank" href="https://github.com/Frege/frege#readme">Frege</a>
		 is a non-strict, pure functional programming language in the spirit of Haskell. It enjoys a strong static type system with type inference. Higher rank types are supported, though type annotations are required for that.

Frege programs are compiled to Java and run in a JVM. Existing Java Classes and Methods can be used seamlessly from Frege.

The Frege programming language is named after and in honor of Gottlob Frege.</p> 
		<h3>Some useful links:</h3>
		<p><a target="_blank" href="https://github.com/Frege/frege/wiki/Getting-Started">How to install Frege standalone?</a></br>
		<a target="_blank" href="https://github.com/Frege/frege/wiki/How-To-Install-Eclipse-FregIDE">fregIDE: Frege Eclipse IDE</a></br>
		<a target="_blank" href="https://github.com/Frege/frege/wiki/NetBeans-Setup">Frege NetBeans setup</a></br>
		<a target="_blank" href="https://github.com/Frege/frege/wiki/Differences-between-Frege-and-Haskell">Differences between Frege and Haskell</a></br>
		<a target="_blank" href="https://github.com/downloads/Frege/frege/Language.pdf">Frege Language Reference</a></br>
		</p>
		</div>
		</div>
	</div>
	<div class="footer">
		Console interface powered by <a target="_blank"
			href="https://github.com/chrisdone/jquery-console">jQuery Console
			library</a>
	</div>
</body>
</html>
​
