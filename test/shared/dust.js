const fs = require('node:fs');
const test = require('ava');
const cons = require('../../');

exports.test = function (name) {
  const user = { name: 'Tobi' };

  // Use case: return upper case string.
  test(`${name} dust should support fetching template name from the context`, (t) => {
    const viewsDir = 'test/fixtures/' + name;
    const templatePath = viewsDir + '/user_template_name.' + name;
    const str = fs.readFileSync(templatePath).toString();

    const locals = {
      user,
      views: viewsDir,
      filename: templatePath
    };

    if (name === 'dust') {
      const dust = require('dustjs-helpers');
      dust.helpers.templateName = function (chunk, context) {
        return chunk.write(context.getTemplateName());
      };

      cons.requires.dust = dust;
    }

    cons[name].render(str, locals, function (err, html) {
      t.is(err, null);
      t.is(html, '<p>Tobi</p>user_template_name');
      t.pass();
    });
  });
};
