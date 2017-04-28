import { Component, OnInit } from '@angular/core';
import { WindowResizeService } from 'app/core';
import {SlidesService} from 'app/slides';
import { Router } from '@angular/router';

@Component({
    selector: 'app-slides-list',
    templateUrl: './slides-list.component.html',
    styleUrls: ['./slides-list.component.scss'],
    providers: [WindowResizeService, SlidesService]
})
export class SlidesListComponent implements OnInit {
    slides: Array<any> = [];
    listHeight_style:any = {
        'height': '350px'
    };;
    constructor(
        private windowResizeService: WindowResizeService,
        private slidesService: SlidesService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.slidesService.getSlidesList()
            .subscribe(
            slide => {
                console.log(slide);
                slide.forEach(s => this.slides.push({
                    id: s._id,
                    title: s.title
                }))
            },
            error => {
                console.log("fail to get Slides list");
            });
        console.log(this.slides)
    }
    /*open Slide*/
    openSlides(e) {
        console.log(e.target.tagName);
        let target = e.target;
        if (target.tagName != "MD-CARD") {
            target = target.parentNode;
        }
        this.router.navigate(['/slides', target.id]);
    }
    createSlides() {
        this.router.navigate(['/createSlides']);
    }
    test() {
        console.log(this.slides);
    }
}