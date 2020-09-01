import { LayoutProcessorsStore } from './LayoutProcessorsStore';
import { Layout } from '../interfaces/Layout';
import { CommandName } from '../interfaces/CommandName';
export declare class LayoutProcessor {
    private layoutProcessorsStore;
    constructor(layoutProcessorsStore: LayoutProcessorsStore);
    process(layout: Layout, commandName: CommandName): Layout;
}
