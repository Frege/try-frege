  $(document).ready(function(){
  var editor =
    CodeMirror.fromTextArea(document.getElementById("editor"),
    {
          theme: 'mbo',
          lineNumbers: true,
          readOnly: false,
          mode: "text/x-haskell",
          autofocus: true,
          scrollbarStyle: "simple",
          extraKeys: {
            "Ctrl-Enter": function(cm) {
              var src = cm.getValue()
              fregeEval(src, function(msgs) {
                var count = msgs.length
                $('#output').empty()
                for (var i = 0; i < count; i++) {
                  message(msgs[i].msg, msgs[i].className)
                  }
              })
            },
            "Shift-Enter": function(cm) {
              fregeEval($.trim($('#replEditor').val()), function(msgs) {
                var count = msgs.length
                $('#output').empty()
                for (var i = 0; i < count; i++) {
                  message(msgs[i].msg, msgs[i].className)
                  }
              })
            },
            "F11": function(cm) {
              cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            },
            "Esc": function(cm) {
              if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
            }
          }
    });
    editor.setSize('100%', '90%')

    $( "#input" ).click(function() {
      editor.focus();
    });

    $('#replEditor').keydown(function (e) {
      if (e.keyCode == 13) {
          fregeEval($('#replEditor').val(), function(msgs) {
                    var count = msgs.length
                    $('#output').empty()
                    for (var i = 0; i < count; i++) {
                      message(msgs[i].msg, msgs[i].className)
                      }
                  })
      }
    });

  var javaSourceEditor =
    CodeMirror.fromTextArea(document.getElementById("javaSource"),
    {
          theme: 'blackboard',
          lineNumbers: true,
          readOnly: true,
          mode: "text/x-java",
          extraKeys: {
            "Ctrl-Q": function(cm) {
              var src = cm.getValue()
              var start = metaStart(src)
              var end = metaEnd(src)
              if (cm.getCursor().line == start || cm.getCursor().line == end) {
                if (!javaSourceEditor.showRuntimeAnnotations) {
                  collapseJavaSourceEditor(start, end)
                  javaSourceEditor.showRuntimeAnnotations = true
                } else {
                  javaSourceEditor.runtimeAnnMarker.clear()
                  javaSourceEditor.showRuntimeAnnotations = false
                }
              } else {
                cm.foldCode(cm.getCursor());
              }
            }
          },
          foldGutter: {
                          rangeFinder: new CodeMirror.fold.combine(
                            CodeMirror.fold.brace,
                            CodeMirror.fold.comment,
                            CodeMirror.fold.indent
                          )
                      },
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    })

  function message(msg,className) {
			var mesg = $('<div class="jquery-console-message">'
			  + msg
			      .replace(/</g, '&lt;')
			      .replace(/>/g, '&gt;')
			      .replace(/(?:\r\n|\r|\n)/g, '<br/>')
			      .replace(/ /g, '&nbsp;')

        + '</div>');
			if (className) mesg.addClass(className);
			$('#output').append(mesg);
		};

  function collapseJavaSourceEditor(start, end) {
    javaSourceEditor.runtimeAnnMarker = javaSourceEditor.markText({line: start, ch: 0}, {line: end, ch: 0}, {
                          replacedWith: document.createTextNode("@(\u2194)"),
                          clearOnEnter: true
                        }
                      )
  }

  /*$("#tabs" ).tabs();
  $("#tabs").height($(window).height() * 0.9);
  $("div.console").height($("#tabs").height() * 0.8);
  $("div.input").height($("#tabs").height() * 0.8);*/
  $( "#javaSourceDialog" ).dialog({
                            modal: true,
                            autoOpen: false,
                            closeOnEscape: true,
                            "height": $(window).height() * 0.9,
                            "width": $(window).width() * 0.6,
                            "title": "Java Source",
                            "position": { my: "right top", at: "right top", of: window }
                          });
  $( "#stdinDialog" ).dialog({
                              modal: true,
                              autoOpen: false,
                              closeOnEscape: true,
                              "height": $(window).height() * 0.4,
                              "width": $(window).width() * 0.5,
                              "title": "Console Input",
                              "position": { my: "right top", at: "right top", of: window }
                             });

  $( "#helpDialog" ).dialog({
                          modal: false,
                          autoOpen: false,
                          closeOnEscape: true,
                          "height": $(window).height() * 0.4,
                          "width": $(window).width() * 0.6,
                          "position": { my: "right top", at: "right top", of: window }
                            });

  $("#compileButton").click(function() {
    var src = editor.getValue();
    fregeEval(src, function(msgs) {
                      var count = msgs.length
                      $('#output').empty()
                      for (var i = 0; i < count; i++) {
                        message(msgs[i].msg, msgs[i].className)
                        }
                   }
    );
  });

  var pasteMode = false;
  var tutorialMode = false;
  var tutPage = 1;

  function successHandler(cmd, report) {
    function showJavaSource(src) {
      javaSourceEditor.setValue(src);
      $("#javaSourceDialog" ).dialog("open")
      javaSourceEditor.refresh();
      collapseJavaSourceEditor(metaStart(src), metaEnd(src))
      javaSourceEditor.showRuntimeAnnotations = true
      report([{"msg": "", "className": "jquery-console-message-info"}]);
    }

    function showHelp(msg) {
      if (msg != '') {
          $("#helpDialog").html(msg);
          $('#helpDialog a').not('[href^="http"],[href^="https"],[href^="mailto:"],[href^="#"]').each(function() {
                      $(this).attr('href', function(index, value) {
                          if (!value) return
                          if (value.substr(0,1) !== "/") {
                              if (value.substr(0,1) == ".") {
                                  value = "http://www.frege-lang.org/doc" + value.substr(1)
                              } else {
                                  value = "http://www.frege-lang.org/doc" + value;
                              }
                          }
                          return value;
                      });
                  });
          $('#helpDialog a').attr("target", "_blank")
          $("#helpDialog").dialog({"title": cmd.split(' ')[1] + " - Documentation"})
          $("#helpDialog" ).dialog("open")
      }
      report([{"msg": '', "className": "jquery-console-message-info"}]);
    }
    return function(data) {
      document.body.style.cursor = 'default';
      var msgs = []
      $('message', $('messages', data)).each(function() {
        var msgType = $.trim($(this).find("type").text());
        var position = $.trim($(this).find("position").text());
        var text = $.trim($(this).find("text").text());
        var className;
        if (msgType == "ERROR") {
          className = "jquery-console-message-error";
        } else if (msgType == "HINT") {
          className = "jquery-console-message-info";
        } else if (msgType == "WARNING") {
          className = "jquery-console-message-warning";
        } else {
          className = "jquery-console-message-success";
        }
        if (text.length != 0) {
          var posPrefix = position.length != 0 ? position + ": " : ""
          msgs.push({'msg': posPrefix + text, 'className': className});
        }
      });
      if (cmd == ":java") {
        if (msgs[0] && msgs[0].msg && $.trim(msgs[0].msg).length != 0) {
          showJavaSource(msgs[0].msg);
        } else {
          report({'msg': '', 'className': 'jquery-console-message-info'})
        }
      } else if (cmd.match(/\s*:help\s+.*/)) {
        if (msgs[0] && msgs[0].msg && $.trim(msgs[0].msg).length != 0) {
          showHelp(msgs[0].msg);
        } else {
          report({'msg': '', 'className': 'jquery-console-message-info'})
        }

      } else {
        // A blank line before starting a new prompt
        msgs.push({'msg': '', 'className': 'jquery-console-message-info'});
        report(msgs);
      }
      //scrollDown();
    }
  }
        
  function failureHandler(report) {
    return function(req, status, error) { 
      document.body.style.cursor = 'default';
      report([{msg:error, className: 'ERROR'}]);
      scrollDown();
      };
  }
  function fregeEval(line, report) {
    if ($.trim(line) == '') {
      report("");
    } else if ($.trim(line) == ':stdin') {
      $("#stdinDialog" ).dialog("open")
      report("")
    } else {
      document.body.style.cursor = 'wait';
      var stdin = $('#stdin').val();
      $.post('eval/', {"cmd": line, "stdin": stdin},
          successHandler(line, report), "xml")
      .error(failureHandler(report))
    }
    
  }

 var console = $('div#console');
 var controller = console.console({
   promptLabel: 'frege> ',
   continuedPromptLabel: '',
   autofocus: false,
   commandHandle:function(line, report) {
     var line = $.trim(line);
     if (pasteMode) {
       if (line.match(/:}\s*$/i)) {
         controller.continuedPrompt = false;
         pasteMode = false;
         var lines = line.split("\n");
         var script = lines.slice(1, lines.length - 1);
         fregeEval(script.join("\n"), report);
       } else {
         controller.continuedPrompt = true;
       }
     } else if (line.match(/^:\{/i)) {
       pasteMode = true;
       controller.continuedPrompt = true;
     } else if (line.match(/^:c/i)) {
       controller.reset();
     } else {
       try {
         fregeEval(line, report);
       } catch (e) {
         return e.toString();
       }
     }
   },
   animateScroll:true,
   promptHistory:true,
   welcomeMessage:'Welcome! Enter Frege code snippets at the prompt ' + 
     'to get them evaluated.\nType ":help" for more information.'
 });

  $("div.replSection").click(function() {
      controller.focus();
    });

  window.github = new Github({
         token: "", // Place a valid oauth token here
         auth: "oauth"
       });
  window.markdown = new Showdown.converter();
  
  window.repo = github.getRepo("frege", "try-frege");
  
  //consoleWindow = controller;

  $("div.replSection").resizable({alsoResize: "div.editorSection"});
  $("div.editorSection").resizable();
  $("div.input").resizable(/*{alsoResize: "div.output"}*/)
  //$("div.output").resizable();

});

function pasteCode(code) {
  consoleWindow.promptText(code);
}

function navigateTutorial(cmd) {
  if (cmd == "hide") {
    $("#tutorial").html("");
    $("#tutorial").hide();
  } else if (cmd == "next") {
    navigateTutorial(tutPage + 1);
  } else if (cmd == "prev") {
    navigateTutorial(tutPage - 1);
  } else {
    repo.read('master', "try-frege-web/src/main/webapp/tutorial/Tutorial-" + cmd + ".md", function(err, contents) {
          if (contents) {
            $("#tutorial").html(markdown.makeHtml(contents));
            tutPage = parseInt(cmd);
          }
    });
  }
}

function metaStart(src) {
  var lines = src.split("\n")
  for (var i = 0; i < lines.length; i++) {
    var metaStartIndex = lines[i].indexOf("@frege.runtime.Meta.FregePackage")
    if (metaStartIndex != -1) return i - 1;
  }
  return -1;
}

function metaEnd(src) {
  var lines = src.split("\n")
  for (var i = 0; i < lines.length; i++) {
    var metaEndIndex = lines[i].indexOf("final public class")
    if (metaEndIndex != -1) return i - 1;
  }
  return -1;
}
