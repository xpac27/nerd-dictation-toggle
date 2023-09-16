// Simple Toogle Button Extension
// Source:https://discourse.gnome.org/t/creating-an-extension-with-a-simple-toggle-button/8794/2

const { Clutter, GObject, St } = imports.gi;
const Util = imports.misc.util;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

const TOGGLE_ON_ICON = 'face-smile-big-symbolic';
const TOGGLE_OFF_ICON = 'face-shutmouth-symbolic';

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init () {
        super._init(0.0, 'Toggle Button');

        this._icon = new St.Icon({
            icon_name: TOGGLE_OFF_ICON,
            style_class: 'popup-menu-icon'
        });

        this.add_child(this._icon);

        this.connect('event', this._onClicked.bind(this));
    }
    _onClicked(actor, event) {
        if ((event.type() !== Clutter.EventType.TOUCH_BEGIN && event.type() !== Clutter.EventType.BUTTON_PRESS)) {
            // Some other non-clicky event happened; bail
            return Clutter.EVENT_PROPAGATE;
        }

        if (this._icon.icon_name === TOGGLE_ON_ICON) {
            this._icon.icon_name = TOGGLE_OFF_ICON;
            Util.spawn(['nerd-dictation', 'suspend'])
        } else {
            this._icon.icon_name = TOGGLE_ON_ICON;
            Main.notify('Toggle has been turned on!');
            Util.spawn(['nerd-dictation', 'resume'])
        }

        return Clutter.EVENT_PROPAGATE;
    }
});

let _indicator;
let _uuid;

function init(meta) {
    _uuid = meta.uuid;
}

function enable() {
    _indicator = new Indicator();

    Main.panel.addToStatusArea(_uuid, _indicator);
    Util.spawn(['nerd-dictation', 'begin', '--full-sentence', '--punctuate-from-previous-timeout', '2', '--numbers-as-digits', '--suspend-on-start'])
}

function disable() {
    Util.spawn(['nerd-dictation', 'end'])

    _indicator.destroy();
    _indicator = null;
}
