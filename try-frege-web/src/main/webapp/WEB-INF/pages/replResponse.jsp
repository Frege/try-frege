<%@ page language="java" contentType="text/xml; charset=UTF-8"
  pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<repl>
  <type>${msgType}</type>

  <c:choose>
  <c:when test="${msgType == 'ERROR'}">
    <message><![CDATA[${msg}]]></message>
  </c:when>
  <c:when test="${msgType == 'MESSAGE'}">
    <message><![CDATA[${msg}]]></message>
  </c:when>
  <c:when test="${msgType == 'SUCCESS'}">
    <message><![CDATA[${msg}]]></message>
    <out>${out}</out>
    <err>${err}</err>
  </c:when>
  <c:otherwise>
    <message></message>
  </c:otherwise>

  </c:choose>
</repl>