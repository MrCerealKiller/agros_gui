import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as ROSLIB from 'roslib';

import { environment } from 'src/environments/environment'
import { RosService } from 'src/app/services/ros.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  // Initialized with temporary image
  img: string = 'iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAeFBMVEUAAAD////s7Ow+Pj5JSUn8/PzGxsahoaH09PSlpaXp6ek5OTlSUlLf399+fn7W1ta2trZbW1saGhqNjY3Ozs4zMzMgICCRkZHU1NRjY2O/v7+urq5GRkZra2tzc3MlJSWZmZmEhIQLCwstLS0UFBR4eHheXl4XFxddaQm0AAAHoElEQVR4nO2dbVvaQBBFFxUUxWoFxaqtIq3+/39YEZUIyZxhs7vZnSf3M9I5Dcm9s9kXN7Au13UB0dUTlq+esHz1hOWrJyxfPWH56gnfdXo3nj+NZ8PYxUSRgnC8dB/6fRG/oOBCwrtnV9HkJEVRQUWE/9yWZknKCigg/LUN6NwoTWHBJBP+2AV0rrCbUSSc1QE6d5CquCASCR/rCZepigsiifCuHtC5n8nKCyCJ8GcTofuRrL72kggbAZ0bJyuwtQTCc4GwIFsUCEcSoTtNV2M7CYSXIuFrKTlcIGx8lK51mK7IVhIIL2RC9ztdlW0kEA6B0D2lK7OFJLc4JMS7ZGW2kER4T4TuPFmd/pII8WfqXAENsZi8+SIWEMLl/rA5mX4q/xAuEw6vEHGRpMwWglGMA74V79MU6i0aiWpo86vKPITjaCI/bTIP4TwiPEXCq6xDuGLMmx+oR/Hr9JfmvcUZIv6JXqe/NIQnfCseRy/UW6p3T+J4xlr5hnDd+0NohlfKNoQr35AeM2KuIVz7DvgPEl5HrdNf6rfcR4j4K2ad/lITDm8QcRqzUG/pZyqc8q14GbFQb+0xF+OWEW/jFeqtfWabKEJ4hq8W95pPowjhser01xfhcLR4uKJWj0P4zWFgvTy1nDjwQXiyWBdIrR6H8Biat2nP1oRfqewvJBNFCI+iFtfxnbAy5eIMPq8I4VHk37y4wdacEkomihCeF6LbMYEF/IUihEeR74CX2721aHhwZyJYGj17E+52DfS/xSE8ijxnR7i6pyN4hiKEx5DnRXR1UYw8QxHCY8hvGMHVtrbUzdIL8Djy+5m6+pRCnqEI4eHlNxPLPdd/2wL+jkN4ePm9yWv8OvKMl4RoH9IMrR9cLl6OJovx5p5t/j7yjPQhnAlnm+bn7HPAQfhCeHSlD+FEOHv49vHlORHSCGjyEC4TznaDyCURUp8hT+0LL4lwVjv55x4I3QsgPkXAENRMuPX73OgWCN0CENOG8CbCmfDQI0KMEUlDeD1h4/V71xMR4vBByhBeRziiyXdISJ6RMoTvEiLf2yXi7wXPUIyEh9I2oYLv7VHCH6E+I10I/0440oWqieIz5BnJQniVUHX9VlI9KKhrqVngFkUbwtF14K8mzwj97zXok1D5+9xL4BknDU1mYK0JR0v+pIfAM9KE8KNI128t8IwkIfxocBfxfiDPSDESfi3ms9aiQZKORsJDijxDY62ZCzxDMSc8e4FnKOaEZy/wjIQhPJrAM+QVi0WIPKOLkfDAmgBiqhAeUQtATBTCYwo8I1EIjyrwjK6mo4QUeEbqkfAYAs/oajpKQNGySgMhnDzDQAiHPsNCCIdZZhZCOKwCshDCwTMMhHDyDAMhnDzDQAgnzzAQwsEzupoTHlLgGRZCOPQZFkI4eIaBEE6eYSCEL2E5i4EQDp7R0ZzwoPonI1oI4eAZFkI49BkWQjjsu2sghNPi2N9d19dejzJhRwszgwo8w0IIB8+wEMLBMyyEcPAMCyEcPKN2f/fCBH1GRwszQ+pG7jOGDVu8lyTwDAshHHY1sxDCYWthCyEcPMNCCAfPMDASTp5hIIQ/yp5hIYTDUk8LIRw8w0IIB8+wEMLBMwyMhJNnGBgJh7EpCyEc+gwLIRz6DAshHDzDQggHz7AQwmGzTwshHDxDu9A1Z8meYSGEQ59hIYRDn2EhhINnjLuuL4DAMyyEcPAMCyFc9gwL01HAM/Qh/CbbCfLQZ6hD+CTf0YEH+VbUhvCV9eTKCJ4x133Lu7kOM2Wcy4i6EP4ZH/JkBM9QhfBNQMqSUfYMVQivRED9b/XVv+R9JW/dqwnh30OukjFhiwYneylC+HaMVzGmnCABnsEhfPf/SMGYdId1OF6XQ3jN/xEyKo4aDSjwDA7hdb4qX/sp77kXVLJnKEbCa3sxiXGYmBAOolGE8Pp3Po2MI9z7Mrhkz1DsE97gq/WMq0seGAAFnqEI4U3zBGoY33/T4RlA4BkcwpvXPW4zrldlxcGQBJ7BIVzYk2tc2ZVj+vFriYjSJPAMjlnSusfZfHL9uJxMN6vqmnadjynZMxQhfK8jiF2cXQhlyZ6h2NZ2nxNZXCdrIWTPUITwPY4gdp2MOsPYFNdEZ4xUCbt5o34oV8UtD3xBlbCLYxwcegaHcPiCKmFHr7jgwEt+AILpVAi1Y3mhJXuG4uZRnpi5OpWMz/yLIvmR7x/Cawi7QpQf+YoQrjoxc306YDc/1GfZM7ioGz3h4KKTBS3QZ3AIp81HKoSDwfm0A0iosF0I3yZcaXiQWKcwJ5zbAj4Wca+zZJNL4dV4fmfehJoQTufNZU6oCOHPEMJzJ1SEcNgYN3vC1iE8f8IBj4SLSwMKIOQQLmabAggVIVy6iCUQcgiXjtwsgpBDuPC3ZRDi7ihCI1YIIS3MFJrhUgiHf0VCYbygFEIYCTdwDSGEG7gPB3IIF/6sIEIhhEtzH0sibA7h0sBkUYRNIVwc0SqLsCGEi21+WYT1IVxe0lEYYZ1nwBTr0ggHs21AegdVHOHg5NtQ+Cu+0i+P8O1m/Oo0Joo3bCUSvuni8ng+Hqle5hdKuId6wvLVE5avnrB89YTlqycsXz1h+foP+g+LgoqeV8wAAAAASUVORK5CYII';

  // ROS
  connection: Subscription;
  imgSub: ROSLIB.Topic;

  constructor(private _ros: RosService) {
    this.connection = this._ros.connection$.subscribe(data => {
      if (data) {
        this.listen();
      }
    });
  }

  ngOnInit() {
  }

  listen() {
    this.imgSub = new ROSLIB.Topic({
      ros: this._ros.getRos(),
      name: environment.imgTopic,
      messageType: 'sensor_msgs/CompressedImage'
    });
    this.imgSub.subscribe(function(message) {
      this.img = message.data;;
    }.bind(this));
  }

  detach() {
    // TODO unsubscribe from ROS topic
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
