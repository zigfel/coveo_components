import Component = Coveo.Component;
import Initialization = Coveo.Initialization;
import ComponentOptions = Coveo.ComponentOptions;
import IComponentBindings = Coveo.IComponentBindings;
import INoResultsEventArgs = Coveo.INoResultsEventArgs;
import IQuerySuccessEventArgs = Coveo.IQuerySuccessEventArgs;
import $$ = Coveo.$$;

declare const require: (svgPath: string) => string;
const SVGIcon = require('./CustomSortDropdown_caret.svg');

export interface ICustomSortDropdownOptions {
}

export class CustomSortDropdown extends Component {
  static ID = 'CustomSortDropdown';

  private sortCriteriasList: HTMLElement;
  private criteriasList: {};
  private currentSearchSort;

  constructor(public element: HTMLElement, public options: ICustomSortDropdownOptions, public bindings: IComponentBindings) {
    super(element, CustomSortDropdown.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, CustomSortDropdown, options);


    this.bind.onRootElement(Coveo.InitializationEvents.beforeInitialization, this.handleBeforeInit);
    this.bind.onRootElement(Coveo.InitializationEvents.afterComponentsInitialization, this.handleAfterComponentsInit);
    this.bind.onRootElement(Coveo.InitializationEvents.afterInitialization, this.handleAfterInit);

    // State Events
    let changeSortEvtName = this.getStateEventName(Coveo.QueryStateModel.eventTypes.changeOne + Coveo.QueryStateModel.attributesEnum.sort);

    this.bind.onRootElement(changeSortEvtName, (args: Coveo.IAttributeChangedEventArg) => this.handleCoveoStateChanged(args));

    this.render();
  }

  private handleCoveoStateChanged(args: Coveo.IAttributeChangedEventArg) {
    this.currentSearchSort = args.value;
   
  }

  private getStateEventName(event: string) {
    return Coveo.QueryStateModel.ID + ':' + event;
  }

  private handleBeforeInit() {
  }

  private handleAfterComponentsInit() {
  }

  private handleAfterInit() {
    this.htmlSortCriteriasList();
  }

  private htmlTextComponent() {
    const pagerText = $$(
      'span',
      {
        className: 'coveo-custom-sort-dropdown-text'
      },
      Coveo.l('SortBy')
    ).el;

    return pagerText;
  }

  private htmlPickerComponent() {
    
    const picker = $$(
         'select',
         {
           className: 'coveo-custom-sort-dropdown-picker'
         }
       );
    
    const changeAction = () => this.handleChangeCriteria();
    picker.on('change', changeAction);

    this.sortCriteriasList = picker.el;
    return picker.el;
  }

  private htmlSortCriteriasList() {
    const criteriasList = [];
    debugger;
    let sorts = document.querySelectorAll(".CoveoSort[data-available-in-dropdown='true']");
    _.each(sorts, (Sort) => {
      const sort = <Coveo.Sort>Coveo.get(<HTMLElement>Sort, 'Sort');

     
      let selectedOption;
      sort.options.sortCriteria.forEach(crit => {
        const key = (crit.sort + ' ' + crit['direction']).trim();

        
        if(key == this.currentSearchSort){
          selectedOption=true;
        }
        this.criteriasList[key] = sort.options.caption;
      });

      let optionLink;

      if(selectedOption){ 
      optionLink = $$(
        'option',
        {
          className: 'coveo-custom-sort-dropdown-list-item-text',
          value: sort.options.caption,
          selected:''
        },
        sort.options.caption
      );
    }
    else{
      optionLink = $$(
        'option',
        {
          className: 'coveo-custom-sort-dropdown-list-item-text',
          value: sort.options.caption
        
        },
        sort.options.caption
      );
    }

     

      this.sortCriteriasList.appendChild(optionLink.el);

    });
  }
  private handleChangeCriteria(){
    var sortCaption = (<HTMLSelectElement>(event.currentTarget)).value;

    debugger;
    let sorts = document.querySelectorAll(".CoveoSort[data-available-in-dropdown='true']");
    _.each(sorts, (Sort) => {
      const sort = <Coveo.Sort>Coveo.get(<HTMLElement>Sort, 'Sort');
      if(sortCaption == sort.options.caption){
        sort.element.click();
      }
      
    });
    
  }
 

  public render() {
    $$(this.element).append(this.htmlTextComponent());
    $$(this.element).append(this.htmlPickerComponent());
    this.criteriasList = {};

  }
}

if (!Initialization.isComponentClassIdRegistered(CustomSortDropdown.ID)) {
  Initialization.registerAutoCreateComponent(CustomSortDropdown);
}