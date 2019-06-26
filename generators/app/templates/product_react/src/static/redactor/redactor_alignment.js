(function($R)
{
    $R.add('plugin', 'alignment', {
        translations: {
    		en: {
    			"align": "Align",
    			"align-left": "Align Left",
    			"align-center": "Align Center",
    			"align-right": "Align Right",
    			"align-justify": "Align Justify"
        },
        zh_cn: {
          "align": "对齐",
          "align-left": "左对齐",
          "align-center": "居中对齐",
          "align-right": "右对齐",
          "align-justify": "两边对齐",
      }
        },
        init: function(app)
        {
            this.app = app;
            this.opts = app.opts;
            this.lang = app.lang;
            this.block = app.block;
            this.toolbar = app.toolbar;
        },
        // public
        start: function()
        {
            var dropdown = {};

    		dropdown.left = { title: this.lang.get('align-left'), api: 'plugin.alignment.set', args: 'left' };
    		dropdown.center = { title: this.lang.get('align-center'), api: 'plugin.alignment.set', args: 'center' };
    		dropdown.right = { title: this.lang.get('align-right'), api: 'plugin.alignment.set', args: 'right' };
    		dropdown.justify = { title: this.lang.get('align-justify'), api: 'plugin.alignment.set', args: 'justify' };
            var $button = this.toolbar.addButton('alignment', { title: this.lang.get('align') });
            $button.setIcon('<i class="re-icon-alignment"></i>');
			$button.setDropdown(dropdown);
        },
        set: function(type)
		{
    		if (type === 'left' && this.opts.direction === 'ltr')
    		{
        		return this._remove();
    		}

    		var args = {
        	    style: { 'text-align': type }
    		};

			this.block.toggle(args);
		},

		// private
		_remove: function()
		{
		    this.block.remove({ style: 'text-align' });
		}
    });
})(Redactor);
