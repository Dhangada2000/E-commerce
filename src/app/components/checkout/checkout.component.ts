import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  //Propertise for credit card years and months
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  checkoutFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      
      shippingAddress: this.formBuilder.group({
        country: [''],
        state: [''],
        city: [''],
        street: [''],
        zipCode: ['']
      }),

      billingAddress: this.formBuilder.group({
        country: [''],
        state: [''],
        city: [''],
        street: [''],
        zipCode: ['']
      }),

      creditCard: this.formBuilder.group({
        cartType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expMonth: [''],
        expYear: ['']
      }),

      reviewYourOrder: this.formBuilder.group({
        totalQuantity: [''],
        shippingFREE: [''],
        totalPrice: ['']
      }),

    }); //checkoutFormGroup

    // Populate credit card months
    // Here + 1 because array count from Zero that why +1
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived credit years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

  }

  copyShippingAddressToBillingAddress(event: any) {

    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
                                      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }// copyShippingAddressToBillingAddress

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expYear);

    // if the current year equals the selected year, then start with current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );


  }// end handleMonthsAndYears

  onSubmit() {
    console.log("Handling the submit button");
    console.log("Customer Infomartion");

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("Email is " + this.checkoutFormGroup.get('customer')?.value.email);

    console.log("Shipping Address");
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log("Billing Address");
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);
    console.log("Credit Card");
    console.log(this.checkoutFormGroup.get('creditCard')?.value);
  } //onSubmit

  // Go to style.css and search(ctrl+f) for "page-m" and change the padding to (10% 30% 10% 5%)


  

}// CheckoutComponent
