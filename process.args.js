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
  var groups = [];
  var cmd;

  args.forEach(function(arg){
    // command
    if(arg.indexOf('-') !== 0) {
      cmd = fs.existsSync(arg) ? path.basename(arg) : arg;
      parameters[cmd] = {};
    }
    // parameters
    else if(cmd) {
      // more than 3 dash line, no use do nothing
      if(arg.indexOf('---') === 0) {}
      // 2 dash line
      else if(arg.indexOf('--') === 0) {
        arg = arg.substr(2);
        var pos = arg.indexOf("=");
        // with no =
        if(pos === -1) {
          typeof parameters[cmd] === 'object' && add.call(parameters[cmd],arg,true);
        }
        // begin with =, do nothing
        else if(pos === 0) {}
        // like key=value
        else {

          var key = arg.substr(0, pos);
          var value = arg.substr(pos + 1);
          typeof parameters[cmd] === 'object' && add.call(parameters[cmd],key,value);
        }
      }
      // 1 dash line
      else {
        arg = arg.substr(1);
        typeof parameters[cmd] === 'object' && add.call(parameters[cmd],arg,true);
      }
    }
  });

  function add(key, value) {
    var prev = this[key];
    if (prev instanceof Array) {
      prev.push(value);
    } else if ("undefined" !== typeof prev) {
      this[key] = [prev, value];
    } else {
      this[key] = value;
    }

    if(groups.indexOf(this) === -1) {
      groups.push(this);
    }
  }

  if(find) {
    if(typeof find === 'boolean' && find === true && groups.length > 0) {
      return groups[0];
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