import { Component, input } from '@angular/core';
import { Nft } from '../_models/nft.model';

@Component({
  selector: 'app-nft',
  standalone: true,
  imports: [],
  templateUrl: './nft.component.html',
  styleUrl: './nft.component.css'
})
export class NftComponent {
  nft = input.required<Nft>();

}
