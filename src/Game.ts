export class Game{

    private _totalItemMadeAmount: number;   
    public get TotalProduction(): number{
        return this._totalItemMadeAmount;
    }
    private _madeItemAmount : number;
    public get ItemAmount() : number {
        return this._madeItemAmount;
    }

    private _materialAmount : number;
    public get MaterialAmount() : number {
        return this._materialAmount;
    }
    
    private _itemMaterCost: number = 200;
    
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
//----------------------------------------------

    constructor() {
        this._madeItemAmount = 0;
        this._materialBuyAmount = 4000;
        this._materialAmount = this._materialBuyAmount;
        this._money = 0;
        this._itemPrice = 15;
        this._materialBuyCost = 200;
        this._totalItemMadeAmount = 0;
        this._lastProductionAmount = 0;
        this._production = 0;
        this._productionCallCounter = 0;       
        this._materialBuyCounter = 0;
        this._materialBuyCallCounter = 0;
    }

    public MadeItem() {
        if (this._materialAmount >= this._itemMaterCost) {
            this._madeItemAmount++;
            this._materialAmount -= this._itemMaterCost;
            this._totalItemMadeAmount++;
        }
    }

    public BuyItem() {
        if (this._madeItemAmount > 0 && Math.random() * 100 < this._demandRate) {
            this._madeItemAmount--;
            this._money += this._itemPrice;
        }
    }

    public UpdateDemandRate(){
        // let rate;
        // if (this._itemPrice <= 40) {
        //   rate = (2 / Math.sqrt(this._itemPrice)) * 100;
        // } else {
        //   const maxRate = (2 / Math.sqrt(40)) * 100;
        //   // 40tl 20%
        //   // 60tl 0%
        //   rate = (maxRate * (60 - this._itemPrice)) / 20;
        // }
        // this._demandRate = Math.floor(Math.max(0, rate));

        let rate: number = Math.floor(100 - (this._itemPrice / 40) * 100);
        if (rate < 0) {
            rate = 0;
        }            

        this._demandRate = rate;
    }

    public CalcProduction() {
        this._productionCallCounter++;
        if (this._productionCallCounter >= 5) {
            this._productionCallCounter = 0;
            this._production = this._totalItemMadeAmount - this._lastProductionAmount;
            this._lastProductionAmount = this._totalItemMadeAmount;
        }
    }

    public BuyMaterial() {
        if (this.CanBuyMaterial) {
            this._money -= this._materialBuyCost;
            this._materialAmount += this._materialBuyAmount;

            this._materialBuyCounter++;
            if (this._materialBuyCounter != 0) {
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
}