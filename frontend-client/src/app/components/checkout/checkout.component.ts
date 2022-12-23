import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/common/Cart';
import { DistanceMatrix } from 'src/app/common/DistanceMatrix';
import { CartDetail } from 'src/app/common/CartDetail';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { District } from 'src/app/common/District';
import { Notification } from 'src/app/common/Notification';
import { Order } from 'src/app/common/Order';
import { Province } from 'src/app/common/Province';
import { ShipUnit } from 'src/app/common/ShipUnit';
import { Ward } from 'src/app/common/Ward';
import { CartService } from 'src/app/services/cart.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ProvinceService } from 'src/app/services/province.service';
import { SessionService } from 'src/app/services/session.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];

  debugStr!: string;
  distanceStr!: string;
  discount!: number;
  amount!: number;
  amountReal!: number;
  shipAmount!:number;
  distanceAmount!:number;
  totalAmount!:number;
  shipUnitAmount!: number;
  dateReceived!: Date;
  dateNow!: Date;
  dateDisplay!: string;
  idShip!: number;

  postForm: FormGroup;

  provinces!: Province[];
  districts!: District[];
  wards!: Ward[];

  shipunits!: ShipUnit[];

  province!: Province;
  district!: District;
  ward!: Ward;

  province_str!: string;
  district_str!: string;
  ward_str!: string;
  address_remain_str!: string;

  province_code!: number;
  district_code!: number;
  ward_code!: number;

  amountPaypal !:number;
  provinceCode!: number;
  districtCode!: number;
  wardCode!: number;
  public payPalConfig ? : IPayPalConfig;

  testValue!: string;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private orderService: OrderService,
    private location: ProvinceService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService) {
    this.postForm = new FormGroup({
      'phone': new FormControl(null, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
      'province': new FormControl(0, [Validators.required, Validators.min(1)]),
      'district': new FormControl(0, [Validators.required, Validators.min(1)]),
      'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
      'number': new FormControl('', Validators.required),
    })
    this.shipunits = [
      {'code': 0, 'name': 'Vận chuyển thường', 'rate': 10000, 'time': 0},
      {'code': 1, 'name': 'Vận chuyển tiết kiệm', 'rate': 8000, 'time': 2},
      {'code': 2, 'name': 'Vận chuyển siêu tốc', 'rate': 15000, 'time': -2},
    ]
    this.dateReceived = new Date();
    this.dateNow = new Date();
    this.idShip = 0;
  }

  ngOnInit(): void {
    this.checkOutPaypal();
    this.webSocketService.openWebSocket();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.discount = 0;
    this.totalAmount = 0;
    this.amount = 0;
    this.amountPaypal = 0;
    this.amountReal = 0;
    this.shipAmount = 0;
    this.distanceAmount = 0;
    this.shipUnitAmount = 0;
    this.province_code = this.district_code = this.ward_code = 0;
    this.getAllItem();
    this.getProvinces();
  }

  getDistanceMatrix(address:any) {
    // this.location.getDistanceMatrix(address.value);
    // this.shipAmount = address.value.length;

    this.location.getDistanceMatrix(address.value).subscribe(data => {
      let jsonStr = JSON.stringify(data);
      let pos: number;
      let i:number;
      pos = jsonStr.indexOf('text');
      let beBracket:number, enBracket:number;
      beBracket = enBracket = 0;
      for (i = pos + 6; i < jsonStr.length; i += 1) {
        if (jsonStr[i] == '"') {
          beBracket = i;
          break;
        }
      }
      for (i = beBracket + 1; i < jsonStr.length; i += 1) {
        if (jsonStr[i] == '"') {
          enBracket = i;
          break;
        }
      }
      this.debugStr = jsonStr;
      // this.shipAmount = jsonStr;
      this.distanceStr = jsonStr.substring(beBracket + 1, enBracket);
      this.distanceAmount = parseFloat(this.distanceStr.substring(0, this.distanceStr.indexOf(' ') + 1));
      this.shipAmount = this.distanceAmount * this.shipunits[this.idShip].rate;
      this.totalAmount = this.amount + this.shipAmount;
      this.amountPaypal = (this.totalAmount/22727.5);
      this.dateReceived = new Date(this.dateNow.getTime() + (1000 * 60 * 60 * 24 * Math.max(1, Math.ceil(this.distanceAmount/60) + this.shipunits[this.idShip].time)));
      this.dateDisplay = this.dateReceived.getDate() + "/" + this.dateReceived.getMonth() + "/" + this.dateReceived.getFullYear();
    })
  }

  getAllItem() {
    let email = this.sessionService.getUser();
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;


      // console.log("debug_1: " + this.cart.address + "/" + typeof(this.cart.address));
      var split = this.cart.address.split(", ");
      // console.log("debug: " + split[0] + "/" + typeof(split));
      let n:number = split.length;
      this.province_str = split[n - 1];
      this.district_str = split[n - 2];
      this.ward_str = split[n - 3]; 
      this.address_remain_str = split[n - 4];

      console.log("debug_1: " + this.province_str);
      console.log("debug_2: " + this.district_str);
      console.log("debug_3: " + this.ward_str);
      console.log("debug_4: " + this.address_remain_str);

      this.location.getAllProvinces().subscribe(data => { // get provinces
        this.provinces = data as Province[];
        for (let i = 0; i < this.provinces.length; i++) {
          let provinceElement = this.provinces[i] as Province;
          if (provinceElement.name === this.province_str) {
            this.province_code = provinceElement.code;

            this.provinceCode = this.province_code;

            console.log("hihi" + this.provinceCode);

            this.location.getDistricts(this.provinceCode).subscribe(data => { // get districts
              this.province = data as Province;
              this.districts = this.province.districts;

              for (let i = 0; i < this.districts.length; i++) {
                let districtsElement = this.districts[i] as District;
                if (districtsElement.name === this.district_str) {
                  this.district_code = districtsElement.code;
      
                  this.districtCode = this.district_code;

                  this.location.getWards(this.districtCode).subscribe(data => {
                    this.district = data as District;
                    this.wards = this.district.wards;

                    for (let i = 0; i < this.wards.length; i++) {
                      let wardsElement = this.wards[i] as District;
                      if (wardsElement.name === this.ward_str) {
                        this.ward_code = wardsElement.code;
            
                        this.wardCode = this.ward_code;
                      }
                    }
                  })
                }
              }
            })

          } else {
          }
        }
      })

      // this.testValue = this.location.getProvinceCode(this.province_str)?.toString();


      this.postForm = new FormGroup({
        'phone': new FormControl(this.cart.phone, [Validators.required, Validators.pattern('(0)[0-9]{9}')]),
        'province': new FormControl(0, [Validators.required, Validators.min(1)]),
        'district': new FormControl(0, [Validators.required, Validators.min(1)]),
        'ward': new FormControl(0, [Validators.required, Validators.min(1)]),
        'number': new FormControl(this.address_remain_str, Validators.required),
      })
      this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {
        this.cartDetails = data as CartDetail[];
        this.cartService.setLength(this.cartDetails.length);
        if (this.cartDetails.length == 0) {
          this.router.navigate(['/']);
          this.toastr.info('Hãy chọn một vài sản phẩm rồi tiến hành thanh toán', 'Hệ thống');
        }
        this.cartDetails.forEach(item => {
          this.amountReal += item.product.price * item.quantity;
          this.amount += item.price;
        })
        this.discount = this.amount - this.amountReal;

        this.amountPaypal = (this.amount/22727.5);
      });
    });
  }

  checkOut() {
    if (this.postForm.valid) {
      Swal.fire({
        title: 'Bạn có muốn đặt đơn hàng này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Không',
        confirmButtonText: 'Đặt'
      }).then((result) => {
        let email = this.sessionService.getUser();
        this.cartService.getCart(email).subscribe(data => {
          this.cart = data as Cart;
          this.cart.address = this.postForm.value.number + ', ' + this.ward.name + ', ' + this.district.name + ', ' + this.province.name;
          this.cart.phone = this.postForm.value.phone;
          this.cartService.updateCart(email, this.cart).subscribe(data => {
            this.cart = data as Cart;
            this.orderService.post(email, this.cart).subscribe(data => {
              let order:Order = data as Order;
              this.sendMessage(order.ordersId);
              Swal.fire(
                'Thành công!',
                'Chúc mừng bạn đã đặt hàng thành công.',
                'success'
              )
              this.router.navigate(['/cart']);
            }, error => {
              this.toastr.error('Lỗi server', 'Hệ thống');
            })
          }, error => {
            this.toastr.error('Lỗi server', 'Hệ thống');
          })
        }, error => {
          this.toastr.error('Lỗi server', 'Hệ thống');
        })
      })

    } else {
      this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
    }
  }

  sendMessage(id:number) {
    let chatMessage = new ChatMessage(this.cart.user.name, ' đã đặt một đơn hàng');
    this.notificationService.post(new Notification(0, this.cart.user.name + ' đã đặt một đơn hàng ('+id+')')).subscribe(data => {
      this.webSocketService.sendMessage(chatMessage);
    })
  }

  getProvinces() {
    this.location.getAllProvinces().subscribe(data => {
      this.provinces = data as Province[];
    })
  }

  getDistricts() {
    this.location.getDistricts(this.provinceCode).subscribe(data => {
      this.province = data as Province;
      this.districts = this.province.districts;
    })
  }

  getWards() {
    this.location.getWards(this.districtCode).subscribe(data => {
      this.district = data as District;
      this.wards = this.district.wards;
    })
  }

  getWard() {
    this.location.getWard(this.wardCode).subscribe(data => {
      this.ward = data as Ward;
    })
  }

  setShipUnit(code: any) {
    this.idShip = code.value;

    this.shipAmount = this.distanceAmount * this.shipunits[this.idShip].rate;
    this.totalAmount = this.amount + this.shipAmount;
    this.amountPaypal = (this.totalAmount/22727.5);

    this.dateReceived = new Date(this.dateNow.getTime() + (1000 * 60 * 60 * 24 * Math.max(1, Math.ceil(this.distanceAmount/60) + this.shipunits[this.idShip].time)));
    this.dateDisplay = this.dateReceived.getDate() + "/" + this.dateReceived.getMonth() + "/" + this.dateReceived.getFullYear();
  }

  setProvinceCode(code: any) {
    this.provinceCode = code.value;
    this.getDistricts();
  }

  setDistrictCode(code: any) {
    this.districtCode = code.value;
    this.getWards();
  }

  setWardCode(code: any) {
    this.wardCode = code.value;
    this.getWard();
  }

  private checkOutPaypal(): void {

    this.payPalConfig = {
        currency: 'USD',
        // clientId: 'Af5ZEdGAlk3_OOp29nWn8_g717UNbdcbpiPIZOZgSH4Gdneqm_y_KVFiHgrIsKM0a2dhNBfFK8TIuoOG',
        clientId: 'AfqHTygEA0QWcX_V2ZATbq_ZMDhFNbb-Hb9CmTk7z8a-x0OgO5qouXpZybewj4ObQBTJGlK2zg_kyzQY',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value:String(this.amountPaypal.toFixed(2)),

                },

            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical',
            color: 'blue',
            size: 'small',
            shape: 'rect',
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then((details: any) => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.checkOut();
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);

        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);

        },
    };
}

}
