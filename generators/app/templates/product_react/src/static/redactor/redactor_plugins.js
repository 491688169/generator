;(function($R) {
  // 官方插件
  $R.add('plugin', 'alignment', {
    translations: {
      en: {
        align: 'Align',
        'align-left': 'Align Left',
        'align-center': 'Align Center',
        'align-right': 'Align Right',
        'align-justify': 'Align Justify'
      },
      zh_cn: {
        align: '对齐',
        'align-left': '左对齐',
        'align-center': '居中对齐',
        'align-right': '右对齐',
        'align-justify': '两边对齐',
        format: '格式',
        image: '图片',
        file: '文件',
        link: '链接',
        bold: '加粗',
        italic: '斜体',
        deleted: '删除线',
        underline: '下划线',
        superscript: 'Superscript',
        subscript: 'Subscript',
        'bold-abbr': 'B',
        'italic-abbr': 'I',
        'deleted-abbr': 'S',
        'underline-abbr': 'U',
        'superscript-abbr': 'Sup',
        'subscript-abbr': 'Sub',
        lists: '列表',
        'link-insert': '插入链接',
        'link-edit': '编辑链接',
        'link-in-new-tab': '在新页面中打开',
        unlink: '取消链接',
        cancel: '取消',
        close: '关闭',
        insert: '插入',
        save: '保存',
        delete: '删除',
        text: '文本',
        edit: '编辑',
        title: '标题',
        paragraph: '段落',
        quote: '引用',
        code: '代码',
        heading1: '标题 1',
        heading2: '标题 2',
        heading3: '标题 3',
        heading4: '标题 4',
        heading5: '标题 5',
        heading6: '标题 6',
        filename: '文件名',
        optional: 'optional',
        unorderedlist: '无序列表',
        orderedlist: '有序列表',
        outdent: '向左缩进',
        indent: '向右缩进',
        horizontalrule: '水平分隔线',
        upload: 'Upload',
        'upload-label': 'Drop files here or click to upload',
        'upload-change-label': 'Drop a new image to change',
        'accessibility-help-label': '富文本编辑器',
        caption: 'Caption',
        bulletslist: 'Bullets',
        numberslist: 'Numbers',
        'image-position': 'Position',
        none: 'None',
        left: 'Left',
        right: 'Right',
        center: 'Center',
        undo: 'Undo',
        redo: 'Redo'
      }
    },
    init: function(app) {
      this.app = app
      this.opts = app.opts
      this.lang = app.lang
      this.block = app.block
      this.toolbar = app.toolbar
    },
    // public
    start: function() {
      var dropdown = {}
      dropdown.left = {
        title: this.lang.get('align-left'),
        api: 'plugin.alignment.set',
        args: 'left'
      }
      dropdown.center = {
        title: this.lang.get('align-center'),
        api: 'plugin.alignment.set',
        args: 'center'
      }
      dropdown.right = {
        title: this.lang.get('align-right'),
        api: 'plugin.alignment.set',
        args: 'right'
      }
      dropdown.justify = {
        title: this.lang.get('align-justify'),
        api: 'plugin.alignment.set',
        args: 'justify'
      }
      var $button = this.toolbar.addButton('alignment', {
        title: this.lang.get('align')
      })
      $button.setIcon('<i class="re-icon-alignment"></i>')
      $button.setDropdown(dropdown)
    },
    set: function(type) {
      if (type === 'left' && this.opts.direction === 'ltr') {
        return this._remove()
      }

      var args = {
        style: { 'text-align': type }
      }

      this.block.toggle(args)
    },

    // private
    _remove: function() {
      this.block.remove({ style: 'text-align' })
    }
  })

  $R.add('plugin', 'fontcolor', {
    translations: {
      en: {
        fontcolor: 'Text Color',
        text: 'Text',
        highlight: 'Highlight'
      }
    },
    init: function(app) {
      this.app = app
      this.opts = app.opts
      this.lang = app.lang
      this.inline = app.inline
      this.toolbar = app.toolbar
      this.selection = app.selection

      // local
      this.colors = this.opts.fontcolors
        ? this.opts.fontcolors
        : [
          '#ffffff',
          '#000000',
          '#eeece1',
          '#1f497d',
          '#4f81bd',
          '#c0504d',
          '#9bbb59',
          '#8064a2',
          '#4bacc6',
          '#f79646',
          '#ffff00',
          '#f2f2f2',
          '#7f7f7f',
          '#ddd9c3',
          '#c6d9f0',
          '#dbe5f1',
          '#f2dcdb',
          '#ebf1dd',
          '#e5e0ec',
          '#dbeef3',
          '#fdeada',
          '#fff2ca',
          '#d8d8d8',
          '#595959',
          '#c4bd97',
          '#8db3e2',
          '#b8cce4',
          '#e5b9b7',
          '#d7e3bc',
          '#ccc1d9',
          '#b7dde8',
          '#fbd5b5',
          '#ffe694',
          '#bfbfbf',
          '#3f3f3f',
          '#938953',
          '#548dd4',
          '#95b3d7',
          '#d99694',
          '#c3d69b',
          '#b2a2c7',
          '#b7dde8',
          '#fac08f',
          '#f2c314',
          '#a5a5a5',
          '#262626',
          '#494429',
          '#17365d',
          '#366092',
          '#953734',
          '#76923c',
          '#5f497a',
          '#92cddc',
          '#e36c09',
          '#c09100',
          '#7f7f7f',
          '#0c0c0c',
          '#1d1b10',
          '#0f243e',
          '#244061',
          '#632423',
          '#4f6128',
          '#3f3151',
          '#31859b',
          '#974806',
          '#7f6000'
        ]
    },
    // messages
    onfontcolor: {
      set: function(rule, value) {
        this._set(rule, value)
      },
      remove: function(rule) {
        this._remove(rule)
      }
    },

    // public
    start: function() {
      var btnObj = {
        title: '字体颜色'
      }

      var $dropdown = this._buildDropdown()

      this.$button = this.toolbar.addButton('字体颜色', btnObj)
      this.$button.setIcon('<i class="re-icon-fontcolor"></i>')
      this.$button.setDropdown($dropdown)
    },

    // private
    _buildDropdown: function() {
      var $dropdown = $R.dom('<div class="redactor-dropdown-cells">')

      this.$selector = this._buildSelector()

      this.$selectorText = this._buildSelectorItem(
        'text',
        this.lang.get('text')
      )
      this.$selectorText.addClass('active')

      this.$selectorBack = this._buildSelectorItem(
        'back',
        this.lang.get('highlight')
      )

      this.$selector.append(this.$selectorText)
      this.$selector.append(this.$selectorBack)

      this.$pickerText = this._buildPicker('textcolor')
      this.$pickerBack = this._buildPicker('backcolor')

      $dropdown.append(this.$selector)
      $dropdown.append(this.$pickerText)
      $dropdown.append(this.$pickerBack)

      this._buildSelectorEvents()

      $dropdown.width(242)

      return $dropdown
    },
    _buildSelector: function() {
      var $selector = $R.dom('<div>')
      $selector.addClass('redactor-dropdown-selector')

      return $selector
    },
    _buildSelectorItem: function(name, title) {
      var $item = $R.dom('<span>')
      $item.attr('rel', name).html(title)
      $item.addClass('redactor-dropdown-not-close')

      return $item
    },
    _buildSelectorEvents: function() {
      this.$selectorText.on(
        'mousedown',
        function(e) {
          e.preventDefault()

          this.$selector.find('span').removeClass('active')
          this.$pickerBack.hide()
          this.$pickerText.show()
          this.$selectorText.addClass('active')
        }.bind(this)
      )

      this.$selectorBack.on(
        'mousedown',
        function(e) {
          e.preventDefault()

          this.$selector.find('span').removeClass('active')
          this.$pickerText.hide()
          this.$pickerBack.show()
          this.$selectorBack.addClass('active')
        }.bind(this)
      )
    },
    _buildPicker: function(name) {
      var $box = $R.dom('<div class="re-dropdown-box-' + name + '">')
      var rule = name == 'backcolor' ? 'background-color' : 'color'
      var len = this.colors.length
      var self = this
      var func = function(e) {
        e.preventDefault()

        var $el = $R.dom(e.target)
        self._set($el.data('rule'), $el.attr('rel'))
      }

      for (var z = 0; z < len; z++) {
        var color = this.colors[z]

        var $swatch = $R.dom('<span>')
        $swatch.attr({ rel: color, 'data-rule': rule })
        $swatch.css({
          'background-color': color,
          'font-size': 0,
          border: '2px solid #fff',
          width: '22px',
          height: '22px'
        })
        $swatch.on('mousedown', func)

        $box.append($swatch)
      }

      var $el = $R.dom('<a>')
      $el.attr({ href: '#' })
      $el.css({
        display: 'block',
        clear: 'both',
        padding: '8px 5px',
        'font-size': '12px',
        'line-height': 1
      })
      $el.html(this.lang.get('none'))

      $el.on('click', function(e) {
        e.preventDefault()
        self._remove(rule)
      })

      $box.append($el)

      if (name == 'backcolor') $box.hide()

      return $box
    },
    _set: function(rule, value) {
      var style = {}
      style[rule] = value

      var args = {
        tag: 'span',
        style: style,
        type: 'toggle'
      }

      this.inline.format(args)
    },
    _remove: function(rule) {
      this.inline.remove({ style: rule })
    }
  })

  $R.add('plugin', 'fontsize', {
    translations: {
      en: {
        size: 'Size',
        'remove-size': 'Remove Font Size'
      },
      zh_cn: {
        size: '字体大小'
      }
    },
    init: function(app) {
      this.app = app
      this.lang = app.lang
      this.inline = app.inline
      this.toolbar = app.toolbar

      // local
      this.sizes = [12, 14, 16, 18, 20, 24, 28, 30]
    },
    // public
    start: function() {
      var dropdown = {}
      for (var i = 0; i < this.sizes.length; i++) {
        var size = this.sizes[i]
        dropdown[i] = {
          title: size + 'px',
          api: 'plugin.fontsize.set',
          args: size
        }
      }

      dropdown.remove = {
        title: this.lang.get('remove-size'),
        api: 'plugin.fontsize.remove'
      }

      var $button = this.toolbar.addButton('fontsize', {
        title: this.lang.get('size')
      })
      $button.setIcon('<i class="re-icon-fontsize"></i>')
      $button.setDropdown(dropdown)
    },
    set: function(size) {
      var args = {
        tag: 'span',
        style: { 'font-size': size + 'px' },
        type: 'toggle'
      }

      this.inline.format(args)
    },
    remove: function() {
      this.inline.remove({ style: 'font-size' })
    }
  })

  $R.add('plugin', 'table', {
    translations: {
      en: {
        table: 'Table',
        'insert-table': 'Insert table',
        'insert-row-above': 'Insert row above',
        'insert-row-below': 'Insert row below',
        'insert-column-left': 'Insert column left',
        'insert-column-right': 'Insert column right',
        'add-head': 'Add head',
        'delete-head': 'Delete head',
        'delete-column': 'Delete column',
        'delete-row': 'Delete row',
        'delete-table': 'Delete table'
      },
      zh_cn: {
        table: '表格',
        'insert-table': '插入表格',
        'insert-row-above': '在上方插入行',
        'insert-row-below': '在下方插入行',
        'insert-column-left': '在左侧插入列',
        'insert-column-right': '在右侧插入列',
        'add-head': '添加头部',
        'delete-head': '删除头部',
        'delete-column': '删除列',
        'delete-row': '删除行',
        'delete-table': '删除表格'
      }
    },
    init: function(app) {
      this.app = app
      this.lang = app.lang
      this.opts = app.opts
      this.caret = app.caret
      this.editor = app.editor
      this.toolbar = app.toolbar
      this.component = app.component
      this.inspector = app.inspector
      this.insertion = app.insertion
      this.selection = app.selection
    },
    // messages
    ondropdown: {
      table: {
        observe: function(dropdown) {
          this._observeDropdown(dropdown)
        }
      }
    },
    onbottomclick: function() {
      this.insertion.insertToEnd(this.editor.getLastNode(), 'table')
    },

    // public
    start: function() {
      var dropdown = {
        observe: 'table',
        'insert-table': {
          title: this.lang.get('insert-table'),
          api: 'plugin.table.insert'
        },
        'insert-row-above': {
          title: this.lang.get('insert-row-above'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.addRowAbove'
        },
        'insert-row-below': {
          title: this.lang.get('insert-row-below'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.addRowBelow'
        },
        'insert-column-left': {
          title: this.lang.get('insert-column-left'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.addColumnLeft'
        },
        'insert-column-right': {
          title: this.lang.get('insert-column-right'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.addColumnRight'
        },
        'add-head': {
          title: this.lang.get('add-head'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.addHead'
        },
        'delete-head': {
          title: this.lang.get('delete-head'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.deleteHead'
        },
        'delete-column': {
          title: this.lang.get('delete-column'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.deleteColumn'
        },
        'delete-row': {
          title: this.lang.get('delete-row'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.deleteRow'
        },
        'delete-table': {
          title: this.lang.get('delete-table'),
          classname: 'redactor-table-item-observable',
          api: 'plugin.table.deleteTable'
        }
      }
      var obj = {
        title: this.lang.get('table')
      }

      var $button = this.toolbar.addButtonBefore('link', 'table', obj)
      $button.setIcon('<i class="re-icon-table"></i>')
      $button.setDropdown(dropdown)
    },
    insert: function() {
      var rows = 2
      var columns = 3
      var $component = this.component.create('table')

      for (var i = 0; i < rows; i++) {
        $component.addRow(columns)
      }

      $component = this.insertion.insertHtml($component)
      this.caret.setStart($component)
    },
    addRowAbove: function() {
      var $component = this._getComponent()
      if ($component) {
        var current = this.selection.getCurrent()
        var $row = $component.addRowTo(current, 'before')

        this.caret.setStart($row)
      }
    },
    addRowBelow: function() {
      var $component = this._getComponent()
      if ($component) {
        var current = this.selection.getCurrent()
        var $row = $component.addRowTo(current, 'after')

        this.caret.setStart($row)
      }
    },
    addColumnLeft: function() {
      var $component = this._getComponent()
      if ($component) {
        var current = this.selection.getCurrent()

        this.selection.save()
        $component.addColumnTo(current, 'left')
        this.selection.restore()
      }
    },
    addColumnRight: function() {
      var $component = this._getComponent()
      if ($component) {
        var current = this.selection.getCurrent()

        this.selection.save()
        $component.addColumnTo(current, 'right')
        this.selection.restore()
      }
    },
    addHead: function() {
      var $component = this._getComponent()
      if ($component) {
        this.selection.save()
        $component.addHead()
        this.selection.restore()
      }
    },
    deleteHead: function() {
      var $component = this._getComponent()
      if ($component) {
        var current = this.selection.getCurrent()
        var $head = $R.dom(current).closest('thead')
        if ($head.length !== 0) {
          $component.removeHead()
          this.caret.setStart($component)
        } else {
          this.selection.save()
          $component.removeHead()
          this.selection.restore()
        }
      }
    },
    deleteColumn: function() {
      var $component = this._getComponent()
      if ($component) {
        var current = this.selection.getCurrent()

        var $currentCell = $R.dom(current).closest('td, th')
        var nextCell = $currentCell.nextElement().get()
        var prevCell = $currentCell.prevElement().get()

        $component.removeColumn(current)

        if (nextCell) this.caret.setStart(nextCell)
        else if (prevCell) this.caret.setEnd(prevCell)
        else this.deleteTable()
      }
    },
    deleteRow: function() {
      var $component = this._getComponent()
      if ($component) {
        var current = this.selection.getCurrent()

        var $currentRow = $R.dom(current).closest('tr')
        var nextRow = $currentRow.nextElement().get()
        var prevRow = $currentRow.prevElement().get()

        $component.removeRow(current)

        if (nextRow) this.caret.setStart(nextRow)
        else if (prevRow) this.caret.setEnd(prevRow)
        else this.deleteTable()
      }
    },
    deleteTable: function() {
      var table = this._getTable()
      if (table) {
        this.component.remove(table)
      }
    },

    // private
    _getTable: function() {
      var current = this.selection.getCurrent()
      var data = this.inspector.parse(current)
      if (data.isTable()) {
        return data.getTable()
      }
    },
    _getComponent: function() {
      var current = this.selection.getCurrent()
      var data = this.inspector.parse(current)
      if (data.isTable()) {
        var table = data.getTable()

        return this.component.create('table', table)
      }
    },
    _observeDropdown: function(dropdown) {
      var table = this._getTable()
      var items = dropdown.getItemsByClass('redactor-table-item-observable')
      var tableItem = dropdown.getItem('insert-table')
      if (table) {
        this._observeItems(items, 'enable')
        tableItem.disable()
      } else {
        this._observeItems(items, 'disable')
        tableItem.enable()
      }
    },
    _observeItems: function(items, type) {
      for (var i = 0; i < items.length; i++) {
        items[i][type]()
      }
    }
  })

  $R.add('class', 'table.component', {
    mixins: ['dom', 'component'],
    init: function(app, el) {
      this.app = app

      // init
      return el && el.cmnt !== undefined ? el : this._init(el)
    },

    // public
    addHead: function() {
      this.removeHead()

      var columns = this.$element
        .find('tr')
        .first()
        .children('td, th').length
      var $head = $R.dom('<thead>')
      var $row = this._buildRow(columns, '<th>')

      $head.append($row)
      this.$element.prepend($head)
    },
    addRow: function(columns) {
      var $row = this._buildRow(columns)
      this.$element.append($row)

      return $row
    },
    addRowTo: function(current, type) {
      return this._addRowTo(current, type)
    },
    addColumnTo: function(current, type) {
      var $current = $R.dom(current)
      var $currentRow = $current.closest('tr')
      var $currentCell = $current.closest('td, th')

      var index = 0
      $currentRow.find('td, th').each(function(node, i) {
        if (node === $currentCell.get()) index = i
      })

      this.$element.find('tr').each(function(node) {
        var $node = $R.dom(node)
        var origCell = $node.find('td, th').get(index)
        var $origCell = $R.dom(origCell)

        var $td = $origCell.clone()
        $td.html('')

        if (type === 'right') $origCell.after($td)
        else $origCell.before($td)
      })
    },
    removeHead: function() {
      var $head = this.$element.find('thead')
      if ($head.length !== 0) $head.remove()
    },
    removeRow: function(current) {
      var $current = $R.dom(current)
      var $currentRow = $current.closest('tr')

      $currentRow.remove()
    },
    removeColumn: function(current) {
      var $current = $R.dom(current)
      var $currentRow = $current.closest('tr')
      var $currentCell = $current.closest('td, th')

      var index = 0
      $currentRow.find('td, th').each(function(node, i) {
        if (node === $currentCell.get()) index = i
      })

      this.$element.find('tr').each(function(node) {
        var $node = $R.dom(node)
        var origCell = $node.find('td, th').get(index)
        var $origCell = $R.dom(origCell)

        $origCell.remove()
      })
    },

    // private
    _init: function(el) {
      var wrapper, element
      if (typeof el !== 'undefined') {
        var $node = $R.dom(el)
        var node = $node.get()
        var $figure = $node.closest('figure')
        if ($figure.length !== 0) {
          wrapper = $figure
          element = $figure.find('table').get()
        } else if (node.tagName === 'TABLE') {
          element = node
        }
      }

      this._buildWrapper(wrapper)
      this._buildElement(element)
      this._initWrapper()
    },
    _addRowTo: function(current, position) {
      var $current = $R.dom(current)
      var $currentRow = $current.closest('tr')
      if ($currentRow.length !== 0) {
        var columns = $currentRow.children('td, th').length
        var $newRow = this._buildRow(columns)

        $currentRow[position]($newRow)

        return $newRow
      }
    },
    _buildRow: function(columns, tag) {
      tag = tag || '<td>'

      var $row = $R.dom('<tr>')
      for (var i = 0; i < columns; i++) {
        var $cell = $R.dom(tag)
        $cell.attr('contenteditable', true)

        $row.append($cell)
      }

      return $row
    },
    _buildElement: function(node) {
      if (node) {
        this.$element = $R.dom(node)
      } else {
        this.$element = $R.dom('<table>')
        this.append(this.$element)
      }
    },
    _buildWrapper: function(node) {
      node = node || '<figure>'

      this.parse(node)
    },
    _initWrapper: function() {
      this.addClass('redactor-component')
      this.attr({
        'data-redactor-type': 'table',
        tabindex: '-1',
        contenteditable: false
      })
    }
  })

  $R.add('plugin', 'video', {
    reUrlYoutube: /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gi,
    reUrlVimeo: /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/,
    translations: {
      en: {
        video: 'Video',
        'video-html-code': 'Video Embed Code or Youtube/Vimeo Link'
      },
      zh_cn: {
        video: '视频',
        'video-html-code': '插入第三方视频'
      }
    },
    modals: {
      video:
        '<form action=""> \
                <div class="form-item"> \
                    <label for="modal-video-input">## video-html-code ## <span class="req">*</span></label> \
                    <textarea id="modal-video-input" name="video" style="height: 160px;"></textarea> \
                </div> \
            </form>'
    },
    init: function(app) {
      this.app = app
      this.lang = app.lang
      this.opts = app.opts
      this.toolbar = app.toolbar
      this.component = app.component
      this.insertion = app.insertion
      this.inspector = app.inspector
    },
    // messages
    onmodal: {
      video: {
        opened: function($modal, $form) {
          $form.getField('video').focus()
        },
        insert: function($modal, $form) {
          var data = $form.getData()
          this._insert(data)
        }
      }
    },
    oncontextbar: function(e, contextbar) {
      var data = this.inspector.parse(e.target)
      if (data.isComponentType('video')) {
        var node = data.getComponent()
        var buttons = {
          remove: {
            title: this.lang.get('delete'),
            api: 'plugin.video.remove',
            args: node
          }
        }

        contextbar.set(e, node, buttons, 'bottom')
      }
    },

    // public
    start: function() {
      var obj = {
        title: this.lang.get('video'),
        api: 'plugin.video.open'
      }

      var $button = this.toolbar.addButtonAfter('image', 'video', obj)
      $button.setIcon('<i class="re-icon-video"></i>')
    },
    open: function() {
      var options = {
        title: this.lang.get('video'),
        width: '600px',
        name: 'video',
        handle: 'insert',
        commands: {
          insert: { title: this.lang.get('insert') },
          cancel: { title: this.lang.get('cancel') }
        }
      }

      this.app.api('module.modal.build', options)
    },
    remove: function(node) {
      this.component.remove(node)
    },

    // private
    _insert: function(data) {
      this.app.api('module.modal.close')

      if (data.video.trim() === '') {
        return
      }

      // parsing
      data.video = this._matchData(data.video)
      // inserting
      if (this._isVideoIframe(data.video)) {
        var $video = this.component.create('video', data.video)
        this.insertion.insertHtml($video)
      }
    },

    _isVideoIframe: function(data) {
      return data.match(/<iframe|<video/gi) !== null
    },
    _matchData: function(data) {
      var iframeStart = '<iframe style="width: 500px; height: 281px;" src="'
      var iframeEnd = '" frameborder="0" allowfullscreen></iframe>'

      if (this._isVideoIframe(data)) {
        var allowed = ['iframe', 'video', 'source']
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi

        data = data.replace(tags, function($0, $1) {
          return allowed.indexOf($1.toLowerCase()) === -1 ? '' : $0
        })
      }

      if (data.match(this.opts.regex.youtube)) {
        data = data.replace(
          this.opts.regex.youtube,
          iframeStart + '//www.youtube.com/embed/$1' + iframeEnd
        )
      } else if (data.match(this.opts.regex.vimeo)) {
        data = data.replace(
          this.opts.regex.vimeo,
          iframeStart + '//player.vimeo.com/video/$2' + iframeEnd
        )
      }

      return data
    }
  })

  $R.add('class', 'video.component', {
    mixins: ['dom', 'component'],
    init: function(app, el) {
      this.app = app

      // init
      return el && el.cmnt !== undefined ? el : this._init(el)
    },

    // private
    _init: function(el) {
      if (typeof el !== 'undefined') {
        var $node = $R.dom(el)
        var $wrapper = $node.closest('figure')
        if ($wrapper.length !== 0) {
          this.parse($wrapper)
        } else {
          this.parse('<figure>')
          this.append(el)
        }
      } else {
        this.parse('<figure>')
      }

      this._initWrapper()
    },
    _initWrapper: function() {
      this.addClass('redactor-component')
      this.attr({
        'data-redactor-type': 'video',
        tabindex: '-1',
        contenteditable: false
      })
    }
  })
})(Redactor)
