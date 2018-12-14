/*! SQLSearchWP-Casjobs - v1.0.0 - by:1.0.0 - license: - 2018-12-13 */+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
;+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
;/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);
;+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
;+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
;(function($) {
	'use strict';

	// PUBLIC CLASS DEFINITION
	// ================================

	var SQLSDEBUG = true;

	var sqlsearchwp = {

		context: '#sqls-container',
		
		identity: '',
		
		levels: [
			'info',
			'warning',
			'danger',
		],
		
		buttons: [
			'submit',
			'images',
			'syntax',
			'clear'
		],
		
		whichs: [
			'test',
			'freeform',
			'searchform',
			'dr14',
			'dr14-secondary'
		],
		targets: {
		dr14:{
		    url:"https://skyserver.sdss.org/casjobs/RestAPI/contexts/dr14/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
			sqlsearchwp.showResults( data , false , true, true, false );
		    }
		},
		dr14Secondary:{
		    url:"https://skyserver.sdss.org/casjobs/RestAPI/contexts/dr14/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data, newWin) {
			sqlsearchwp.showResults( data , false , true, true, sqlsearchwp.newWin );
		    }
		}
		},
		newWin:false,
		/*query: { 
			test: 
				'SELECT TOP 10 '+
				'p.objid,p.ra,p.dec,p.u,p.g,p.r,p.i,p.z, '+
				'p.run, p.rerun, p.camcol, p.field, '+
				's.specobjid, s.class, s.z as redshift, '+
				's.plate, s.mjd, s.fiberid '+
			'FROM PhotoObj AS p '+
				'JOIN SpecObj AS s ON s.bestobjid = p.objid '+
			'WHERE '+
				'p.u BETWEEN 0 AND 19.6 '+
			'AND g BETWEEN 0 AND 20' ,
			prod: ''
			},*/
			
		init: function(context){
			//console.log(php_vars.context);
			//sqlsearchwp.context = '#' + php_vars.context;
			sqlsearchwp.context = $(context);
			sqlsearchwp.identity = context.substring(context.length - 1, context.length);
			//console.log(sqlsearchwp.context);
						
			var s=sqlsearchwp;
			
			// get base url of files, test or prod query, target query location, and how to show results.
			var webroot = $( sqlsearchwp.context ).data('sqls-webroot');
			var which = $( sqlsearchwp.context ).data('sqls-which');
			var target = sqlsearchwp.targets[which];
			console.log(which);
			console.log(sqlsearchwp.context);
			
			//console.log(sqlsearchwp.context + " " + php_vars.color);
			
			//$(sqlsearchwp.context + " .sqls-query").prop("style","color: " + php_vars.color);
			
			//initialize query to be default text
			target.data.Query = "select top 10 p.objid, p.ra, p.dec, p.g, p.r, s.z from photoObj p join specObj s on s.bestobjid = p.objid where p.ra between -0.1 and 0.1 and p.dec between -0.1 and 0.1";
			// Show the Search Page
			//sqlsearchwp.showMessage( 'Welcome' , 'Please enjoy this form.' , 'info' , false );
			this.showInstructions( webroot+"includes/" );
			this.showForm( sqlsearchwp.context , false , true );
			this.showResults( '<pre>Results Empty!\n\n<strong>Check Syntax</strong> or <strong>Submit</strong> to get results</pre>' , false , false, false, false);
			
			// Prevent form submitting/reloading page
			$(".sqls-form", sqlsearchwp.context).on( "submit" , function( e ){ e.preventDefault(); });
			$(".sqls-searchform", sqlsearchwp.context).on( "submit" , function( e ){ e.preventDefault(); });
			
			// Add (delegated) click event handlers to buttons
			//$( sqlsearchwp.context ).on( "click" , "#sqls-submit" , sqlsearchwp.doSubmit );
			//console.log(sqlsearchwp.context);
			$(".sqls-edit", sqlsearchwp.context).on('click', sqlsearchwp.enableQuery);
			$(".sqls-query", sqlsearchwp.context).on('input', sqlsearchwp.doQueryUpdate);
			$(".sqls-download", sqlsearchwp.context).on('click', sqlsearchwp.download);
			$(".sqls-newWindow", sqlsearchwp.context).on('change', sqlsearchwp.updateCheckbox);
			$(".sqls-submit", sqlsearchwp.context).on( "click" , { target:target , which:which } , sqlsearchwp.doSubmit );
			$(".sqls-syntax", sqlsearchwp.context).on( "click" , sqlsearchwp.doSyntax );
			$(".sqls-reset", sqlsearchwp.context).on( "click" , sqlsearchwp.doReset );
			/*var uagent = navigator.userAgent.toLowerCase();
			if (uagent.search("iphone") > -1) {
				document.getElementById('sqls-form').innerHTML = '<table width=50%><tr><td><button id="sqls-edit" name="sqls-edit" class ="sqls-edit btn btn-primary" data-unlock="yes">Edit</button></td><td><button id="sqls-reset" name="sqls-reset" class="sqls-reset btn btn-tertiary">Reset</button></td></tr></table><textarea id="sqls-query" name="cmd" class="sqls-query" data-colnum=60 rows=10 cols=60 disabled>SELECT TOP 10 p.objid,p.ra,p.dec,p.u,p.g,p.r,p.i,p.z,p.run, p.rerun, p.camcol, p.field, s.specobjid, s.class, s.z as redshift,s.plate, s.mjd, s.fiberid FROM PhotoObj AS p JOIN SpecObj AS s ON s.bestobjid = p.objid WHERE p.u BETWEEN 0 AND 19.6 AND g BETWEEN 0 AND 20</textarea><table width=50%><tr>	<td><button id="sqls-submit" name="sqls-submit" class="sqls-submit btn btn-primary">Submit</button></td><td><button id="sqls-syntax" name="sqls-syntax" data-sqls-submitto="http://skyserver.sdss.org/dr14/en/tools/search/x_results.aspx?searchtool=SQL&TaskName=Skyserver.Search.SQL&ReturnHtml=true&format=html&syntax=Syntax&cmd=" class="sqls-syntax btn btn-secondary">Check Syntax</button></td></tr></table>';
			}
			//document.getElementsByTagName("BODY")[0].onresize = sqlsearchwp.doResize;
			//sqlsearchwp.doResize();
				
			/*if ( which ==="searchform" ) {
				$( sqlsearchwp.context ).on( "click" , "#sqls-images" , sqlsearchwp.doSubmit );
				$( sqlsearchwp.context ).on( "change" , "#sqls-inregion" , sqlsearchwp.toggleFootprint );
				$( sqlsearchwp.context ).on( "change" , "#sqls-forobjects" , sqlsearchwp.toggleRedshifts );
				$( sqlsearchwp.context ).on( "click" , "#sqls-fpcheck" , sqlsearchwp.doFootprint );
				$( sqlsearchwp.context ).on( "click" , "#sqls-generate" , sqlsearchwp.doGenerate );
				$( 'form#sqls-searchform' ).on( "change" , "select" , sqlsearchwp.doUpdate );
				$( 'form#sqls-searchform' ).on( "change" , "input" , sqlsearchwp.doUpdate );
				}*/
			
		},
		
		/*correctIDs: function() {
			document.getElementById('sqls-instructions').id = 'sqls-instructions-' + sqlsearchwp.identity;
			document.getElementById('sqls-form').id = 'sqls-form-' + sqlsearchwp.identity;
			document.getElementById('sqls-edit').id = 'sqls-edit-' + sqlsearchwp.identity;
			document.getElementById('sqls-syntax').id = 'sqls-syntax-' + sqlsearchwp.identity;
			document.getElementById('sqls-lock').id = 'sqls-lock-' + sqlsearchwp.identity;
			document.getElementById('sqls-query').id = 'sqls-query-' + sqlsearchwp.identity;
			document.getElementById('sqls-reset').id = 'sqls-reset-' + sqlsearchwp.identity;
			document.getElementById('sqls-submit').id = 'sqls-submit-' + sqlsearchwp.identity;
			document.getElementById('sqls-newWindow').id = 'sqls-newWindow-' + sqlsearchwp.identity;
			document.getElementById('myModal').id = 'myModal-' + sqlsearchwp.identity;
			document.getElementById('sqls-hour').id = 'sqls-hour-' + sqlsearchwp.identity;
			document.getElementById('sqls-results-outer').id = 'sqls-results-outer-' + sqlsearchwp.identity;
			document.getElementById('sqls-results').id = 'sqls-results-' + sqlsearchwp.identity;
			document.getElementById('sqls-download').id = 'sqls-download-' + sqlsearchwp.identity;
			document.getElementById('sqls-results-wrap').id = 'sqls-results-wrap-' + sqlsearchwp.identity;
			document.getElementById('sqls-form-wrap').id = 'sqls-form-wrap-' + sqlsearchwp.identity;
			document.getElementById('sqls-formwrapper').id = 'sqls-formwrapper-' + sqlsearchwp.identity;
			//document.getElementsByName('instruct')[0].href = "#sqls-instructions-" + sqlsearchwp.identity;
			//document.getElementsByName('instruct')[0].name = "instruct-" + sqlsearchwp.identity;
			//document.getElementsByName('search')[0].href = "#sqls-form-" + sqlsearchwp.identity;
			//document.getElementsByName('search')[0].name = "search-" + sqlsearchwp.identity;
			//document.getElementsByName('mode')[0].href = "#myModal-" + sqlsearchwp.identity;
			//document.getElementsByName('mode')[0].name = "mode-" + sqlsearchwp.identity;
			//document.getElementsByName('result')[0].href = "#sqls-results-outer-" + sqlsearchwp.identity;
			//document.getElementsByName('result')[0].name = "result-" + sqlsearchwp.identity;
		},*/
		
		updateCheckbox: function(e) {
			console.log("new tab");
			var setting = e.currentTarget.dataset.value;
			if (setting === "no") {
				setting = "yes";
				sqlsearchwp.newWin = true;
				e.currentTarget.dataset.value = setting;
			} else {
				setting = "no";
				sqlsearchwp.newWin = false;
				e.currentTarget.dataset.value = setting;
			}
		},
		
		openWindow: function(content) {
			var type = 'text/html';
			var a = document.createElement("a");
			var file = new Blob([content], {type: type});
			//window.open(URL.createObjectURL(file));
			a.href = URL.createObjectURL(file);
			a.target = "_blank";
			a.click();
		},
		
		download: function(e) {
			//console.log('hi');
			var docText = sessionStorage.getItem('queryResults' + sqlsearchwp.identity);
			var lines = docText.split('\n');
			docText = '';
			for (var i = 0; i < lines.length-1; i++) {
				var values = lines[i].split(',');
				for (var x = 0; x < values.length; x++) {
					values[x] = '\"'.concat(values[x]);
					values[x] += '\"';
					docText += values[x];
					if (x !== values.length - 1) {
						docText += ',';
					}
				}
				if (i !== lines.length - 1) {
					docText += '\n';
				}
			}
			//console.log(docText);
			var name = 'results.csv';
			var type = 'text/csv';
            var a = document.createElement("a");
			var file = new Blob([docText], {type: type});
			//window.open(URL.createObjectURL(file));
			a.href = URL.createObjectURL(file);
			a.download = name;
			a.click();
			//window.open('data:text/csv;charset=utf-8,' + escape(docText), 'results.csv');
		},

		enableQuery: function(e) {
		if(e.currentTarget.dataset.unlock === "yes") {
		    $(".sqls-query", sqlsearchwp.context).prop("disabled", false);
		    e.currentTarget.dataset.unlock = "no";
			e.currentTarget.innerHTML = 'Lock';
			$(".sqls-lock", sqlsearchwp.context).prop("style", "display: none;");
		}
		else {
		    $(".sqls-query", sqlsearchwp.context).prop("disabled", true);
		    e.currentTarget.dataset.unlock = "yes";
			e.currentTarget.innerHTML='Unlock';
			$(".sqls-lock", sqlsearchwp.context).prop("style", "");
		}
	        },

		/**
		 *@summary Update the inner html of the query textarea with what the user enters
		 *
		 *@param Object e Event Object
		 **/
		doQueryUpdate: function(e) {
		
                   var textValue = e.target.value;
		   $(".sqls-query", sqlsearchwp.context).innerHTML = textValue;
		   sqlsearchwp.targets.dr14.data.Query = textValue;
		   sqlsearchwp.targets.dr14Secondary.data.Query = textValue;

	        },
		
		/**
		 * @summary Submits form data to target db
		 * 
		 * @param Object e Event Object
		**/
		doSubmit: function( e ) {
			console.log(sqlsearchwp.context);
			
			// Get target db from form data
		
			//var display = $( sqlsearchwp.context ).data('sqls-display');
			//var _query = e.currentTarget.dataset.sqlsSubmitto +
			//encodeURI( $( '#sqls-query' ).val() );
			$(".sqls-hour", sqlsearchwp.context).prop("style", "");
			var query = e.data.target.data.Query;
			var target = e.data.target;
			var which = e.data.which;

			if ( which === 'dr14' || which === 'dr14Secondary') {
			    target.data = {"Query":query};
			    $.ajax( target );
			    
			}
			else {
			    
			    //send query from form to skyserverws and listen for return
			    var xhttp;
			    xhttp = new XMLHttpRequest();
			    xhttp.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
				    var response = this.responseText;
				    response = response.replace(/.*<body.*?>/i , "");
				    response = response.replace(/<\/body.*/i , "");

				    sqlsearchwp.showResults( response , false , true, true );
					sqlsearchwp.showForm( '' , true , false );
				}
			    };
			    xhttp.open("GET", query , true);
			    xhttp.send();
			}
			
			/*if ( display === 'div' && false) {				
				//send query from form to skyserverws and listen for return
				var xhttp;
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4 && this.status === 200) {
						var response = this.responseText;
						response = response.replace(/.*<body.*?>/i , "");
						response = response.replace(/<\/body.*//*i , "");
						sqlsearchwp.showResults( response , false , true );
						sqlsearchwp.showForm( '' , true , false );
					}
				};
				xhttp.open("GET", _query , true);
				xhttp.send();
			} else if ( display === 'iframe' && false) {
				sqlsearchwp.showResults( '' , false , true);
				$('#sqls-results').append('<div class="embed-responsive embed-responsive-4by3"><iframe  class="embed-responsive-item" src="' + _query + '" name="sqls-iframe" id="sqls-iframe"></iframe></div>');
				sqlsearchwp.showForm( '' , true , false );
			} else {
				console.log( "Display type not supported: " + display + "." );
			}*/
			
		},
		
		/**
		 * @summary Sends form data to skyserverws for syntax review
		 * 
		 * @param Object e Event Object
		**/
		doSyntax: function( e ) {
			//if (SQLSDEBUG) { console.log('doSyntax'); }
			$(".sqls-hour", sqlsearchwp.context).prop("style", "");
			// Get target db from form data
			var display = $( sqlsearchwp.context ).data('sqls-display');
			var _query = e.currentTarget.dataset.sqlsSubmitto +
				encodeURI( $(".sqls-query", sqlsearchwp.context).val() );

			if ( display === 'div' ) {				
				//send query from form to skyserverws and listen for return
				var xhttp;
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4 && this.status === 200) {
						var response = this.responseText;
						sqlsearchwp.showResults( response , false , true, false );
					}
				};
				xhttp.open("GET", _query, true);
				xhttp.send();
				
			} else if ( display === 'iframe' ) {
				
			    sqlsearchwp.showResults( '' , false , true, false);
				$(sqlsearchwp.context + " .sqls-results").append('<div class="embed-responsive embed-responsive-4by3"><iframe  class="embed-responsive-item" src="' + _query + '" name="sqls-iframe" id="sqls-iframe-' + sqlsearchwp.identity + '"></iframe></div>');
				sqlsearchwp.showForm( '' , true , false );
				
			} else {
				
				console.log( "Display type not supported: " + display + "." );
				
			}
		},
		
		/**
		 * @summary Resets form data
		 * 
		 * @param Object e Event Object
		**/
		doReset: function( e ) {
			// Reset query - don't do this while testing...
			sqlsearchwp.showResults( '<pre>Results Empty!\n\n<strong>Check Syntax</strong> or <strong>Submit</strong> to get results</pre>' , false , false, false, false );
			sqlsearchwp.showForm( sqlsearchwp.context , false , true );
		},
		
		doCollapse: function( toggle, container, show ) {
			$('.collapse').collapse();
			if ( show === true ) {
				$(container).collapse('show');
			} else {
				$(container).collapse('hide');
			}
		},
		
		showInstructions: function( instructions ) {
			var instContainer = $(".sqls-instructions", sqlsearchwp.context);
			var instWrapper = $(".sqls-instructions-wrap", sqlsearchwp.context);
			var which = $( sqlsearchwp.context ).data('sqls-which');

			var xhttp;
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					var response = this.responseText;
					$( instContainer ).html(response);
				}
			};
			xhttp.open("GET", instructions + 'instructions-' + which + '.txt' , true);
			xhttp.send();
		},
		
		showForm: function( context , append , show ) {
			var toggle = $('.sqls-form-wrap>h2>a[data-toggle]', sqlsearchwp.context);
			var container = $(".sqls-form-wrap", sqlsearchwp.context);
			if (SQLSDEBUG) { console.log(  $( toggle ).attr('href') ); }
			
			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			//var _query = sqlsearchwp.query[ $( context ).data('sqls-which') ];
			
			//$( '#sqls-query' ).prop( 'value' , sqlsearchwp.query[ $( context ).data('sqls-which') ] );
			sqlsearchwp.doCollapse(sqlsearchwp.context + ' .sqls-form-wrap>h2>a[data-toggle]', container, show );
			
		},
		
		/**
		 * @summary Appends or updates the displayed Results.
		 * 
		 * @param String $results Results to display
		 * @param Boolean $append Append or replace current message(s)
		**/
		showResults: function( results , append , show, format, newWin ) {
			if(format) {
				sessionStorage.setItem('queryResults' + sqlsearchwp.identity, results);
				$(".sqls-download", sqlsearchwp.context).prop("style", "");
			} else {
				$(".sqls-download", sqlsearchwp.context).prop("style", "display:none;");
			}
			var container = $(".sqls-results", sqlsearchwp.context);

			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			contents += ( results !== undefined ) ? results : '' ;
			if (format) {
			    contents = sqlsearchwp.formatResults(contents);
			} 
			$(".sqls-hour", sqlsearchwp.context).prop("style", "display: none;");
			$(container).html(contents);
			if (newWin) {
				sqlsearchwp.openWindow(contents);
			}
			sqlsearchwp.doCollapse(sqlsearchwp.context + ' .sqls-results-wrap>h2>a[data-toggle]', $(".sqls-results-outer", sqlsearchwp.context), show );
		},

		formatResults: function(data) {
		        var output = '<pre><table class="table-bordered table-responsive">';
		        var lines = data.split('\n');
			for(var i = 0; i < lines.length - 1; i++) {
			    output += '<tr>';
			    var items = lines[i].split(',');
			    var symbolBegin = '<td>';
			    var symbolEnd = '</td>';
			    if (i === 0) {
				symbolBegin = '<th>';
				symbolEnd = '</th>';
			    }
			    for (var x = 0; x < items.length; x++) {
				output += symbolBegin;
				output += items[x];
				output += symbolEnd;
			    }
			    output += '</tr>';
			}
			output += '</table></pre>';
			//output += '<div class="clearfix"></div><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 text-center"><button id="sqls-download" name="sqls-download" class ="sqls-download btn btn-primary btn-dr14">Download</button></div></div>';
			return output;
			
	        }
	};

	$(document).ready( function(  ) {
		var divs = document.getElementsByClassName("sqls-wrap");
		for(var i = 0; i < divs.length; i++) {
			//console.log(divs[i].id);
			//if($(divs[i].id).length === 1) {
				var id = '#' + divs[i].id;
				sqlsearchwp.init(id);
				//sqlsearchwp.init(id);
				//console.log(id);
			//}
			/*else {
				if (SQLSDEBUG) { console.log('Error running sqlsearchwp.js. One and only one "#' + divs[i].id + '" expected.');}
			}*/
		}
		//if ( $( '#' + php_vars.context ).length === 1 ) {
			//sqlsearchwp.init(  );
		//} else {
			//if (SQLSDEBUG) { console.log('Error running sqlsearchwp.js. One and only one "#sqls-container" expected.');}
		//}
	} );
	
})(jQuery);