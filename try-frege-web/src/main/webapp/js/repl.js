$(document).ready(function() {
  var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
          theme: 'mbo',
          lineNumbers: true,
          readOnly: false,
          mode: 'text/x-haskell',
          autofocus: true,
          scrollbarStyle: 'simple',
          extraKeys: {
            'Ctrl-Enter': evaluateEditor,
            'F11': function(cm) {
              cm.setOption('fullScreen', !cm.getOption('fullScreen'));
            },
            'Esc': function(cm) {
              if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
            }
          }
    });
    editor.setSize('100%', '97%');

  var javaSourceEditor = CodeMirror.fromTextArea(document.getElementById('javaSource'), {
      theme: 'mbo',
      lineNumbers: true,
      readOnly: true,
      mode: 'text/x-java',
      autofocus: true,
      scrollbarStyle: 'simple',
      extraKeys: {
        'Ctrl-Q': function(cm) {
          var src = cm.getValue();
          var start = metaStart(src);
          var end = metaEnd(src);
          if (cm.getCursor().line == start || cm.getCursor().line == end) {
            if (!javaSourceEditor.showRuntimeAnnotations) {
              collapseJavaSourceEditor(start, end);
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
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    });
    javaSourceEditor.setSize('100%', '95%');

    function evaluateEditor() {
      var cmd = ':load editor';
      terminal.exec(cmd);
    }

    var replConsole = $('div#console');
    var pasteModeCode = '';

    var terminal = replConsole.terminal(function(command, term) {
        var helpInputMatch;

        function evaluate(cmd) {
          term.pause();
          fregeEval(cmd, function(msgs) {
            term.resume();
            term.echo(
              msgs.map(function (m) {
                return '<div class="' + m.className + '"><pre>' + m.msg + '</pre></div>';
              })
              .join(''),
              {raw: true}
            );
            term.echo('<div/>', {raw:true});
          });
        }

        if (command !== '') {
            if (pasteMode && command !== ':}') {
              pasteModeCode += '\n' + command;
            } else if (command === ':{') {
              pasteMode = true;
              pasteModeCode = '';
              term.set_prompt('> ');
            } else if (command === ':}') {
              pasteMode = false;
              term.set_prompt('frege> ');
              evaluate(pasteModeCode);
            } else if (command.match(/^:c/i)) {
              term.clear();
            } else if (helpInputMatch = command.match(/^:help\s+(.*)/i)) {
              var helpItem = helpInputMatch[1];
              showHelp(helpItem);
              term.echo('<div/>', {raw:true});
            } else if (command === ':load editor') {
              evaluate(editor.getValue());
             } else {
              evaluate(command);
            }
        }
    }, {
        greetings: 'Welcome! Enter Frege code snippets at the prompt ' +
                   'to get them evaluated.\nType ":help" for more information.\n',
        name: 'Frege REPL',
        prompt: 'frege> '
    });

  function collapseJavaSourceEditor(start, end) {
    javaSourceEditor.runtimeAnnMarker = javaSourceEditor.markText({
        line: start,
        ch: 0
      }, {
        line: end,
        ch: 0
      }, {
        replacedWith: document.createTextNode('@(\u2194)'),
        clearOnEnter: true
      });
  }

  $( '#javaSourceDialog' ).dialog({
                            modal: true,
                            autoOpen: false,
                            closeOnEscape: true,
                            'height': $(window).height() * 0.9,
                            'width': $(window).width() * 0.6,
                            'title': 'Java Source'
                          });

  $( '#stdinDialog' ).dialog({
                              modal: true,
                              autoOpen: false,
                              closeOnEscape: true,
                              'height': $(window).height() * 0.4,
                              'width': $(window).width() * 0.5,
                              'title': 'Console Input'
                             });

  $( '#helpDialog' ).dialog({
                          modal: true,
                          autoOpen: false,
                          closeOnEscape: true,
                          'height': $(window).height() * 0.9,
                          'width': $(window).width() * 0.6
                            });

  $('#evaluateEditor').click(evaluateEditor);

  var pasteMode = false;

  function showHelp(helpItem) {
      if (helpItem) {
        $('#helpDialog' )
             .html('<iframe style="border: 0px; " src="http://hoogle.haskell.org:8081/?hoogle='
                    + encodeURIComponent(helpItem) + '" width="100%" height="100%"></iframe>');
        $('#helpDialog').dialog('option', 'title', helpItem + ' - Frege API Search');
        $('#helpDialog').dialog('open');
      }
    }

  function successHandler(cmd, report) {
    function showJavaSource(src) {
      javaSourceEditor.setValue(src);
      $('#javaSourceDialog' ).dialog('open');
      javaSourceEditor.refresh();
      collapseJavaSourceEditor(metaStart(src), metaEnd(src));
      javaSourceEditor.showRuntimeAnnotations = true;
      report({'msg': '', 'className': 'jquery-console-message-info'});
    }

    return function(data) {
      document.body.style.cursor = 'default';
      var msgs = [];
      $('message', $('messages', data)).each(function() {
        var msgType = $.trim($(this).find('type').text());
        var position = $.trim($(this).find('position').text());
        var text = $.trim($(this).find('text').text());
        var className;
        if (msgType == 'ERROR') {
          className = 'jquery-console-message-error';
        } else if (msgType == 'HINT') {
          className = 'jquery-console-message-info';
        } else if (msgType == 'WARNING') {
          className = 'jquery-console-message-warning';
        } else {
          className = 'jquery-console-message-success';
        }
        if (text.length != 0) {
          var posPrefix = position.length != 0 ? position + ': ' : ''
          msgs.push({'msg': posPrefix + text, 'className': className});
        }
      });
      if (cmd == ':java') {
        if (msgs[0] && msgs[0].msg && $.trim(msgs[0].msg).length != 0) {
          showJavaSource(msgs[0].msg);
        }
        report({'msg': '', 'className': 'jquery-console-message-info'});
      } else {
        msgs.push({'msg': '', 'className': 'jquery-console-message-info'});
        report(msgs);
      }
    }
  }
        
  function failureHandler(report) {
    return function (req, status, error) {
      document.body.style.cursor = 'default';
      report([{msg:error, className: 'ERROR'}]);
    };
  }

  function fregeEval(line, report) {
    if ($.trim(line) == '') {
      report('');
    } else if ($.trim(line) == ':stdin') {
      $('#stdinDialog' ).dialog('open')
      report('');
    } else {
      document.body.style.cursor = 'wait';
      var stdin = $('#stdin').val();
      $.post(
        'eval/',
        {'cmd': line, 'stdin': stdin},
        successHandler(line, report), 'xml'
      )
      .error(failureHandler(report));
    }
    
  }
});

function metaStart(src) {
  var lines = src.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var metaStartIndex = lines[i].indexOf('@frege.runtime.Meta.FregePackage')
    if (metaStartIndex != -1) return i - 1;
  }
  return -1;
}

function metaEnd(src) {
  var lines = src.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var metaEndIndex = lines[i].indexOf('final public class')
    if (metaEndIndex != -1) return i - 1;
  }
  return -1;
}
