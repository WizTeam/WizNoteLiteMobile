import { Store } from '../components/Store';
import { UniqueIdProvider } from '../adapters/UniqueIdProvider';
import { ColorService } from '../adapters/ColorService';
import { AssetService } from '../adapters/AssetResolver';
import { Options } from '../interfaces/Options';
import { Deprecations } from './Deprecations';
import { OptionProcessorsStore } from '../processors/OptionProcessorsStore';
import { CommandName } from '../interfaces/CommandName';
export declare class OptionsProcessor {
    private store;
    private uniqueIdProvider;
    private optionProcessorsRegistry;
    private colorService;
    private assetService;
    private deprecations;
    constructor(store: Store, uniqueIdProvider: UniqueIdProvider, optionProcessorsRegistry: OptionProcessorsStore, colorService: ColorService, assetService: AssetService, deprecations: Deprecations);
    processOptions(options: Options, commandName: CommandName): void;
    processDefaultOptions(options: Options, commandName: CommandName): void;
    private processObject;
    private resolveObjectPath;
    private processColor;
    private processWithRegisteredProcessor;
    private processImage;
    private processButtonsPassProps;
    private processComponent;
}
