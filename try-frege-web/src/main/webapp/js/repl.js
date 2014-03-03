$(document).ready(function(){

  var hwEditor =
  CodeMirror.fromTextArea(document.getElementById("helloworldEditor"),
  {
        theme: 'blackboard',
        lineNumbers: true,
        readOnly: true,
        mode: "text/x-haskell"
  }).setValue(    "module helloworld.Main where\n\n" +
                  "quicksort :: Ord a => [a] -> [a]\n" +
                  "quicksort []     = []\n" +
                  "quicksort (p:xs) = (quicksort lesser) ++ [p] ++ (quicksort greater) where\n" +
                  "  lesser  = filter (< p) xs\n" +
                  "  greater = filter (>= p) xs\n\n" +
                  "main _ = println $ quicksort [2,5,4,3,1,7,6]\n");

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


  function collapseJavaSourceEditor(start, end) {
    javaSourceEditor.runtimeAnnMarker = javaSourceEditor.markText({line: start, ch: 0}, {line: end, ch: 0}, {
                          replacedWith: document.createTextNode("@(\u2194)"),
                          clearOnEnter: true
                        }
                      )
  }

  $("#tabs" ).tabs();
  $("#tabs").height($(window).height() * 0.9);
  $("div.console").height($("#tabs").height() * 0.8);
  $("div.input").height($("#tabs").height() * 0.8);
  $( "#javaSourceDialog" ).dialog({
                            modal: true,
                            autoOpen: false,
                            closeOnEscape: true,
                            "height": $(window).height() * 0.9,
                           "width": $(window).width() * 0.6,
                           "title": "Java Source",
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

  var pasteMode = false;
  var tutorialMode = false;
  var tutPage = 1;
  var console = $('div.console');

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
                              if (value.substr(0,2) == "..") {
                                  value = window.location.pathname + "doc" + value.substr(2)
                              } else {
                                  value = window.location.pathname + "doc" + value;
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
          msgs.unshift({'msg':text, 'className': className});
        }
      });
      if (cmd == ":java") {
        if (msgs[0] && msgs[0].msg && $.trim(msgs[0].msg).length != 0) {
          showJavaSource(msgs[0].msg);
        } else {
          report({'msg': '', 'className': 'jquery-console-message-info'})
        }
      } else if (cmd.match(/\s*:help\s+.*/)) {
        showHelp(msgs[0].msg);
      } else {
        report(msgs);
      }
      scrollDown();
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
    } else {
      document.body.style.cursor = 'wait';
      $.post('eval/', {"cmd": line},
          successHandler(line, report), "xml")
      .error(failureHandler(report))
    }
    
  }
  
  function scrollDown() {
    console.animate({"scrollTop": console[0].scrollHeight}, "slow");
  }
  
  
 var controller = console.console({
   promptLabel: 'frege> ',
   continuedPromptLabel: '',
   autofocus: true,
   commandHandle:function(line, report){
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
     } else if (tutorialMode && line.match(/^:.*/)) {
       if (line.match(/:q.*/i)) {
          tutorialMode = false;
          tutPage = 1;
          navigateTutorial('hide');
          $("div.console").parent().animate({width:"100%"}, "slow");
          report("Exiting tutorial!");
        } else if (line.match(/^:\d+$/) || line == ":next" || line == ":prev") {
          var tutorialCmd = line.substring(1);
          navigateTutorial(tutorialCmd);
          report("");
        } else {
          fregeEval(line, report);
        }
     } /*
         * else if (line.match(/^:tutorial/i)) { tutorialMode = true;
         * $("div.console").parent().css({width:"50%"});
         * $("#tutorial").parent().css({width:"50%"}, "slow");
         * $("#tutorial").show(); navigateTutorial(tutPage); report("Entering
         * tutorial... Type :q to exit.\n" + "You can browse through tutorial by
         * typing :1 for tutorial 1,\n" + ":2 for tutorial 2 and so on or by
         * typing :next and :prev.\n" + "On the right side, the tutorial
         * contents will be displayed."); }
         */ else {
       try {
         fregeEval(line, report);
       } catch (e) {
         return e.toString();
       }
     }
     scrollDown();
   },
   animateScroll:true,
   promptHistory:true,
   welcomeMessage:'Welcome! Enter Frege code snippets at the prompt ' + 
     'to get them evaluated.\nType ":help" for more information.'
 });
 controller.promptText('');
      
  window.github = new Github({
         token: "", // Place a valid oauth token here
         auth: "oauth"
       });
  window.markdown = new Showdown.converter();
  
  window.repo = github.getRepo("frege", "try-frege");
  
  consoleWindow = controller;
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