/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

/* Ugly. This is here so that we don't crash old libnm-glib based shells unnecessarily
 * by loading the new libnm.so. Should go away eventually */
import GLib from 'gi://GLib';
import { Extension, ExtensionMetadata } from 'resource:///org/gnome/shell/extensions/extension.js';
import Utils from './src/utils.js';

import GnomeStatsProContainer from './src/container.js';

export default class GnomeStatsProExtension extends Extension {
    private timeout: number = 0;
    private container?: InstanceType<typeof GnomeStatsProContainer>;

    constructor(metadatas: ExtensionMetadata) {
        super(metadatas);

        this.initTranslations('gnome-stats-pro2@aldunelabs.com');

        Utils.init(this, metadatas, this.getSettings());
    }

    public enable(): void {
        this.container = new GnomeStatsProContainer();

        // Startup delay to allow the initialization of the monitors
        // avoiding graphical glitches / empty widgets
        if (this.timeout === 0) {
            this.timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
                if (this.container) {
                    this.container.place(this.uuid);
                }

                this.timeout = 0;

                return false;
            });
        }
    }

    public disable(): void {
        if (this.timeout !== 0) {
            GLib.source_remove(this.timeout);
            this.timeout = 0;
        }

        try {
            this.container?.destroy();
        } catch (e: any) {
            Utils.error('Error destroying container', e);
        }

        this.container = undefined;
    }
}