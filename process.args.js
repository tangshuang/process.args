/**
 * @package process.args
 * light-weight command line arguments parser for cli application
 *
 * @author: frustigor
 * @repository: https://github.com/tangshuang/process.args.git
 */

var fs = require('fs');
var path = require('path');

module.exports = function processArgs(find) {
  var args = process.argv.slice(1);

  // if there are no parameters
  if(!args || args.length === 0) {
    return;
  }

  var parameters = {};
  var commands = [];
  var cmd;

  args.forEach(function(arg){
    // command
    if(arg.indexOf('-') !== 0) {
      cmd = fs.existsSync(arg) ? path.basename(arg) : arg;
      commands.push(cmd);
      parameters[cmd] = {};
    }
    // parameters
    else if(cmd && typeof parameters[cmd] === 'object') {
      var obj = parameters[cmd];
      // more than 4 dash line, no use do nothing
      if(arg.indexOf('----') === 0) {
        return true;
      }
      // 3 dash line, super param
      else if(arg.indexOf('---') === 0) {
        arg = arg.substr(3);
        paserEach(parameters,arg,commands);
      }
      // 2 dash line
      else if(arg.indexOf('--') === 0) {
        arg = arg.substr(2);
        paserTo(obj,arg);
      }
      // 1 dash line
      else {
        arg = arg.substr(1);
        paserTo(obj,arg);
      }
    }
  });

  function paserEach(obj,str,props) {
    props.forEach(function(prop){
        paserTo(obj[prop],str);
    });
  }

  function paserTo(obj,str) {
    var pos = str.indexOf("=");
    // with no =
    if(pos === -1) {
      set(obj,str,true,true);
    }
    // begin with =, do nothing
    else if(pos === 0) {}
    // like key=value
    else {
      var key = str.substr(0, pos);
      var value = str.substr(pos + 1);
      set(obj,key,value);
    }
  }

  function set(obj,key,value,cover) {
    // cover previous value
    if(cover) {
      obj[key] = value;
      reutrn;
    }

    var prev = obj[key];
    if (prev instanceof Array) {
      prev.push(value);
    } 
    else if ("undefined" !== typeof prev) {
      obj[key] = [prev, value];
    } 
    else {
      obj[key] = value;
    }
  }

  if(find) {
    if(typeof find === 'boolean' && find === true && commands.length > 0) {
      return parameters[commands[0]];
    }
    else if(parameters[find]) {
      return parameters[find];
    }
    else {
      return null;
    }
  }

  return parameters;
}