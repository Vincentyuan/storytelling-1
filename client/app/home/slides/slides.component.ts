import { Component, OnInit, Inject, ViewChild, ViewChildren, ElementRef, AfterViewInit, QueryList, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {WindowResizeService} from '../../window-resize.service';
//import { ScrollDirective} from './scroll.directive';
import {PageScrollInstance, PageScrollService, PageScrollConfig} from 'ng2-page-scroll';
import {DOCUMENT, DomSanitizer} from '@angular/platform-browser';
import {SlidesService} from '../slides.service';
import { BarChartComponent, ForceDirectedGraphComponent} from '../../charts/index';

@Component({
    selector: 'app-slides',
    templateUrl: './slides.component.html',
    styleUrls: ['./slides.component.scss'],
    providers: [WindowResizeService, SlidesService],
    encapsulation: ViewEncapsulation.None
})
export class SlidesComponent implements OnInit, AfterViewInit, AfterViewChecked {
    slides: Array<any> = [];
    slideTextTransformed: Array<any> = [];
    slideTitle: String;
    slideHeight_style: any = {
        'height': '72px'
    };
    slideHeight: number;
    curSlideIndex: number = 0;
    slideNum: number;
    inScrollProcess: boolean = false;
    charts: Array<any> = [];
    loadContentAni: Array<boolean> = []; //indicator for content load animation
    easeContentAni: Array<boolean> = []; //indicator for content ease(fade away) animation
    @ViewChildren('chart') chartEle: any;

    constructor(
        private windowResizeService: WindowResizeService,
        private pageScrollService: PageScrollService,
        private slidesService: SlidesService,

        @Inject(DOCUMENT) private document: any,
        private sanitizer: DomSanitizer,
        private router: Router,
        private route: ActivatedRoute


    ) {
        /* config of scroll*/
        PageScrollConfig.defaultScrollOffset = 50;
        PageScrollConfig.defaultEasingLogic = {
            ease: (t: number, b: number, c: number, d: number): number => {
                // easeInOutExpo easing
                if (t === 0) return b;
                if (t === d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        };
        /*set the slide size to fit window size*/
        this.windowResizeService.height$.subscribe(height => {
            this.slideHeight_style = {
                'height': (height - 50) + 'px' //50 is the height of header
            };
            this.slideHeight = height - 50;
        })

    }
    ngOnInit() {
        let id;
        this.route.params.subscribe(params => {
            id = params['slidesId'];
            console.log(id);
        });
        /* generate and initialize slides*/
        this.slidesService.getSlides(id)
            .subscribe(
            slide => {
                this.slides = slide.slides;
                this.slideNum = this.slides.length;
                this.slideTitle = slide.title;
                this.slides.forEach(
                    (slide, index) => {
                        slide.text = this.sanitizer.bypassSecurityTrustHtml(slide.text);
                        this.loadContentAni.push(true);
                        this.easeContentAni.push(false);
                    }
                )
                console.log("slides.....", this.slides);
                setTimeout(_ => this.initCharts());
            },
            error => {
                console.log("fail to createSlides");
            });
        //  window.location.hash = '#slide-0';
        //  this.goToSlide(0);
    }
    ngAfterViewInit() {


    }
    ngAfterViewChecked() {

    }
    /*init the charts*/
    initCharts() {
        let charts = this.chartEle.toArray();
        console.log("the chart element are:", charts);
        charts.forEach(e => {
            this.charts.push(e);
            console.log("init finished.", charts);
        });
        charts.forEach((e, i) => {
            if (e.constructor.name != 'ElementRef') {
                let data = this.slides[i].data;
                e.setData(data);
                e.init();
            }

        });

    }

    /*Chart operation*/
    loadChart(index) {
        if (this.slides[index].graph != 'noGraph') {
            this.charts[index].load();
        }
    }
    easeChart(index) {
        if (this.slides[index].graph != 'noGraph') {
            this.charts[index].ease();
        }
    }
    loadContent(index) {
        this.loadContentAni[index] = false;
        setTimeout(_ => this.loadContentAni[index] = true, 625);
    }
    easeContent(index) {
        this.easeContentAni[index] = false;
        setTimeout(_ => this.easeContentAni[index] = true);
    }
    /*slide switch operation*/
    lastSlide() {
        /*  if (this.charts.length == 0 || this.charts === undefined) {
              this.initCharts();
          }*/
        this.curSlideIndex = this.getCurSlideIndex();
        if (this.curSlideIndex > 0) {
            this.easeChart(this.curSlideIndex - 1);

            this.curSlideIndex--;
            this.goToSlide(this.curSlideIndex);

            if (this.curSlideIndex != 0)
                this.loadChart(this.curSlideIndex - 1);

        }
    }
    nextSlide() {
        /*  if (this.charts.length == 0 || this.charts === undefined) {
              this.initCharts();
          }*/


        this.curSlideIndex = this.getCurSlideIndex();
        if (this.curSlideIndex < this.slideNum) {
            if (this.curSlideIndex != 0) {
                this.easeChart(this.curSlideIndex - 1);
                this.easeContent(this.curSlideIndex - 1);
            }
            this.curSlideIndex++;
            this.goToSlide(this.curSlideIndex );
            this.loadChart(this.curSlideIndex - 1);
            /*add animation to text content*/
            this.loadContent(this.curSlideIndex - 1);
        }
        else {
            /*this.snackBar.openFromComponent(ScrollToEndComponent, {
                duration: 500,
            });*/

        }
    }
    releaseLock() {


    }
    goToSlide(index: number): void {
        setTimeout(_ => {
            if (this.inScrollProcess) return;
            console.log("in scroll process .............");
            this.inScrollProcess = true;
            let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#slide-' + index);
            this.pageScrollService.start(pageScrollInstance);

           setTimeout(_=> {this.inScrollProcess = false;} ,0);
        }, 0)

    };
    getCurSlideIndex(): number {
        let scrollDis = document.body.scrollTop;
        let curIndex = Math.round(scrollDis / this.slideHeight);
        return curIndex;
    }
    check() {
        return true;
    }
}
