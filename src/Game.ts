export class Game{

    //Game start and end time info
    private _startDate: Date;
    private _endDate: Date;
    public get TotalPlayTime(): number{
        return this._endDate.getTime() - this._startDate.getTime();
    }

    private _totalItemMadeAmount: number;   
    public get TotalProduction(): number{
        return this._totalItemMadeAmount;
    }
    private _itemStockAmount : number;
    public get ItemAmount() : number {
        return this._itemStockAmount;
    }

    private _materialAmount : number;
    public get MaterialAmount() : number {
        return this._materialAmount;
    }
    
    private _itemMaterCost: number;
    
    private _money : number;
    public get Money(): number{
        return this._money;
    }

    private _itemPrice: number;
    public get ItemPrice(): number{
        return this._itemPrice;
    }

    private _materialBuyAmount: number;
    private _materialBuyCost: number;
     _materialBuyCounter: number;
    private _materialBuyCallCounter: number;
    public get MaterialBuyCost(): number{
        return this._materialBuyCost;
    }
    public get CanBuyMaterial(): boolean { 
        return this._money >= this._materialBuyCost;
    }

    private _demandRate: number;
    public get DemandRate(): number{
        return this._demandRate;
    }

    private _lastProductionAmount: number;
    private _productionCallCounter: number;
    private _production: number;
    public get Production(): number{
        return this._production;
    }

    //Automation
    private _errandBoyCount: number;
    private _foremanCount: number;
    private _expertCount: number;
    private _warehouseManager: boolean;

    private _errandBoyBaseCost: number;
    private _errandBoyCurrentBuyCost: number;

    private _foremanBaseCost: number;
    private _foremanCurrentBuyCost: number;

    private _expertBaseCost: number;
    private _expertCurrentBuyCost: number;

    //Automation - BuyCost
    public get ErrandBoyBuyCost(): number{
        return this._errandBoyCurrentBuyCost;
    }
    public get ForemanBuyCost(): number{
        return this._foremanCurrentBuyCost;
    } 
    public get ExpertBuyCost(): number{
        return this._expertCurrentBuyCost;
    }

    //Automation - Count
    public get ErrandCount() : number {
        return this._errandBoyCount;
    }
    public get ForemanCount() : number {
        return this._foremanCount;
    }
    public get ExpertCount() : number {
        return this._expertCount;
    }

    //Automation - CanBuy
    public get CanBuyErrandBoy() {
        return this._money >= this._errandBoyCurrentBuyCost;
    }
    public get CanBuyForeman() {
        return this._money >= this._foremanCurrentBuyCost;
    }
    public get CanBuyExpert() {
        return this._money >= this._expertCurrentBuyCost;
    }
    public get CanBuyWarehouseManager() {
        return this._money >= 500;
    }

    public get WarehouseManagerStr() : string {
        if (this._warehouseManager) {
            return "Var";
        } else {
            return "Yok";
        }
    }
    public get WarehouseManager() : boolean{
        return this._warehouseManager;
    }

    private _errandIsActive: boolean;
    private _foremanIsActive: boolean;
    private _expertIsActive: boolean;
    private _warehouseManagerIsActive: boolean;
    
    //Game Status
    private _isOver: boolean;
    public get IsOver(): boolean{
        if (this._isOver) {
            return this._isOver;
        }

        let isOver = this._money < this._materialBuyCost && this._materialAmount < this._itemMaterCost && this._itemStockAmount == 0;

        if (!this._isOver && isOver) {
            this._isOver = isOver;
            this._endDate = new Date();
        }

        return this._isOver;
    }
//----------------------------------------------

    constructor() {
        this.Start();
    }

    public Start() {
        this._itemMaterCost = 200;
        this._itemStockAmount = 0;
        this._materialBuyAmount = 10000;
        this._materialAmount = this._materialBuyAmount;
        this._money = 250000;
        this._itemPrice = 15;
        this._materialBuyCost = 200;              
        this._materialBuyCounter = 0;
        this._materialBuyCallCounter = 0;
      
        //To Calculate Productivity
        this._lastProductionAmount = 0;
        this._production = 0;
        this._productionCallCounter = 0;    

        //Game Status
        this._isOver = false;        
        this._startDate = new Date();
        this._endDate = new Date();
        this._totalItemMadeAmount = 0;    
        
        //Auto Generation
        this._errandBoyBaseCost = 2000;
        this._errandBoyCurrentBuyCost = this._errandBoyBaseCost;
        this._foremanBaseCost = 6000;
        this._foremanCurrentBuyCost = this._foremanBaseCost;
        this._expertBaseCost = 12000;
        this._expertCurrentBuyCost = this._expertBaseCost;
        this._errandBoyCount = 0;
        this._foremanCount = 0;
        this._expertCount = 0;
        this._warehouseManager = false;
        this._errandIsActive = true;
        this._foremanIsActive = true;
        this._expertIsActive = true;
        this._warehouseManagerIsActive = true;
    }

    public MadeItem(amount: number = 1) {
        
        for (let index = 1; index <= amount; index++) {
            if (this._warehouseManager && this._warehouseManagerIsActive) {
                this.CheckMaterialAmount();
            }

            if (this._materialAmount < this._itemMaterCost) {
                return;
            }
            
            this._itemStockAmount++;
            this._materialAmount -= this._itemMaterCost;
            this._totalItemMadeAmount++;
        }      
    }

    public BuyItem() {
        if (this._itemStockAmount > 0 && Math.random() * 100 < this._demandRate) {
            this._itemStockAmount--;
            this._money += this._itemPrice;
        }
    }

    public UpdateDemandRate(){
        let rate;
        if (this._itemPrice <= 40) {
          rate = (2 / Math.sqrt(this._itemPrice)) * 100;
        } else {
          const maxRate = (2 / Math.sqrt(40)) * 100;
          // 40tl 20%
          // 60tl 0%
          rate = (maxRate * (60 - this._itemPrice)) / 20;
        }
        this._demandRate = Math.floor(Math.max(0, rate));

        // let rate: number = Math.floor(100 - (this._itemPrice / 40) * 100);
        // if (rate < 0) {
        //     rate = 0;
        // }            

        // this._demandRate = rate;
    }

    public CalcProduction() {
        this._productionCallCounter++;
        if (this._productionCallCounter >= 5) {
            this._productionCallCounter = 0;
            this._production = this._totalItemMadeAmount - this._lastProductionAmount;
            this._lastProductionAmount = this._totalItemMadeAmount;
        }
    }

    public BuyMaterial(userCalled: boolean = false) {
        if (this.CanBuyMaterial && (this._materialBuyCost < 350 || userCalled)) {
            this._money -= this._materialBuyCost;
            this._materialAmount += this._materialBuyAmount;

            this._materialBuyCounter++;   
            if (this._materialBuyCounter != 0 && this._materialBuyCost <= 1000) {
                this._materialBuyCost += Math.floor((200/100) * ((this._materialBuyCounter * 3) * 10));
            }
        }
    }

    public IncreasePrice() {
        this._itemPrice++;
    }

    public DecreasePrice() {
        if (this._itemPrice >= 2) {
            this._itemPrice--;
        }
    }

    public UpdateMaterialBuyCost(){
        this._materialBuyCallCounter++;

        if (this._materialBuyCallCounter >= 50) {
            this._materialBuyCounter = 0;
            this._materialBuyCallCounter = 0;
            this._materialBuyCost = 200;
        }
    }   
    private CheckMaterialAmount() {
        if (this._materialAmount < 500 && this._money > this._materialBuyCost) {
            this.BuyMaterial();
        }
    }
    
    //Automation -------------------------------------
    public BuyErrandBoy() {
        this._errandBoyCount++;      
        this._money -= this._errandBoyCurrentBuyCost;
        this._errandBoyCurrentBuyCost = ((this._errandBoyBaseCost / 100) * this._errandBoyCount) + this._errandBoyCurrentBuyCost;
    }   
    public BuyForeman() {
        this._foremanCount++;
        this._money -= this._foremanCurrentBuyCost;
        this._foremanCurrentBuyCost = ((this._foremanBaseCost / 100) * this._foremanCount) +  this._foremanCurrentBuyCost;
    }  
    public BuyExpert() {
        this._expertCount++;
        this._money -= this._expertCurrentBuyCost;
        this._expertCurrentBuyCost = ((this._expertBaseCost / 100) * this._expertCount) +  this._expertCurrentBuyCost;
    }
    public BuyWarehouseManager() {
        if (this._warehouseManager) {
            return;
        }

        this._warehouseManager = true;
        this._money -= 500;
    }

    private automationTimer: number = 0;
    public Automation() {
        this.automationTimer++;        

        if (this.automationTimer < 15) {
            return;
        } else {
            this.automationTimer = 0;
        }
            
        if (this._errandBoyCount> 0 && this._errandIsActive){
            this.MadeItem(this._errandBoyCount);
        }

        if (this._foremanCount > 0 && this._foremanIsActive){
            this.MadeItem(this._foremanCount * 2);
        }

        if (this._expertCount > 0 && this._expertIsActive){
            this.MadeItem(this._expertCount * 3);
        }
    } 
    
    public ToggleAutomation(key: string) {
        switch (key) {
            case "ERRAND":
                this._errandIsActive = !this._errandIsActive;
                break;
            case "FOREMAN":
                this._foremanIsActive = !this._foremanIsActive;
                break;
            case "EXPERT":
                this._expertIsActive = !this._expertIsActive;
                break;
            case "MANAGER":
                this._warehouseManagerIsActive = !this._warehouseManagerIsActive;
                break;
            default:
                break;
        }    
    }

    public AutomationStatus(key: string) : boolean {
        switch (key) {
            case "ERRAND":
                return this._errandIsActive;
            case "FOREMAN":
                return this._foremanIsActive;
            case "EXPERT":
                return this._expertIsActive;
            case "MANAGER":
                return this._warehouseManagerIsActive;
            default:
                return false;
        }
    }
}