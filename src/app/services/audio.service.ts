import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { AudioStates } from '../interfaces/audio-states';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private stopAudio = new Subject();

  private audioObj = new Audio();

  public audioEvents = [
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay'
  ];

  private state: AudioStates = {
    playing: false,
    displayCurrentTime: '',
    displayDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
  };

  public files: any = [
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Radhe Shyam/Soch Liya - Radhe Shyam 128 Kbps.mp3',
      name: 'Soch Liya',
      artist: 'Arijit Singh',
      image: 'https://pagalsong.in/uploads/thumbnails/300x300/id3Picture_630022418.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Radhe Shyam/Main Ishq Mein Hoon - Radhe Shyam 128 Kbps.mp3',
      name: 'Main Ishq Mein Hoon',
      artist: 'Manan Bhardwaj',
      image: 'https://pagalsong.in/uploads/thumbnails/300x300/id3Picture_558840190.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Radhe Shyam/Aashiqui Aa Gayi - Radhe Shyam 128 Kbps.mp3',
      name: 'Aashique aa gayi',
      artist: 'Arijit Singh',
      image: 'https://pagalsong.in/uploads/thumbnails/300x300/id3Picture_175316129.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Bhool Bhulaiyaa 2/Bhool Bhulaiyaa 2 Title Track - Bhool Bhulaiyaa 2 128 Kbps.mp3',
      name: 'Bhool Bhulaiyaa 2 Title Track',
      artist: 'Tanishk Bagchi',
      image: 'https://pagalsong.in/uploads//thumbnails/300x300/id3Picture_1766196912.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Bhool Bhulaiyaa 2/De Taali - Bhool Bhulaiyaa 2 128 Kbps.mp3',
      name: 'De Taali',
      artist: 'Yo Yo Honey Singh',
      image: 'https://pagalsong.in/uploads//thumbnails/300x300/id3Picture_1657948769.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Laal Singh Chaddha/Main Ki Karaan - Laal Singh Chaddha 128 Kbps.mp3',
      name: 'Main Ki Karaan',
      artist: 'Sonu Nigam',
      image: 'https://pagalsong.in/uploads//thumbnails/300x300/id3Picture_637798760.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Designer - Guru Randhawa/Designer - Guru Randhawa 128 Kbps.mp3',
      name: 'Designer',
      artist: 'Guru Randhawa',
      image: 'https://pagalsong.in/uploads//thumbnails/300x300/id3Picture_1995057696.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Atrangi Re/Rait Zara Si - Atrangi Re 128 Kbps.mp3',
      name: 'Rait Zara Si',
      artist: 'Arijit Singh',
      image: 'https://pagalsong.in/uploads//thumbnails/300x300/id3Picture_385220201.jpg'
    },
    {
      url: 'https://pagalsong.in/uploads/systemuploads/mp3/Jersey/Mehram - Jersey 128 Kbps.mp3',
      name: 'Mehram',
      artist: 'Sachet Tandon',
      image: 'https://pagalsong.in/uploads//thumbnails/300x300/id3Picture_1718338069.jpg'
    }
  ];

  // This function assigns the track to audio file and sets the states for the track

  private trackObject(url: string) {
    return new Observable((observer) => {
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        this.resetState();
      };
    });
  }

  // This function adds the events to the audio track

  private addEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach((event) => {
      obj.addEventListener(event, handler);
    });
  }

  // This function removes the events to the audio track

  private removeEvents(obj: HTMLAudioElement, events: any[], handler: (event: Event) => void) {
    events.forEach((event) => {
      obj.removeEventListener(event, handler);
    });
  }

  private stateChange: BehaviorSubject<AudioStates> = new BehaviorSubject(
    this.state
  );

  // This function updates the events to the audio track

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.displayDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.displayCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      playing: false,
      displayCurrentTime: '',
      displayDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
    };
  }

  public playAudio(url: any) {
    return this.trackObject(url).pipe(takeUntil(this.stopAudio));
  }

  public play() {
    this.audioObj.play();
  }

  public pause() {
    this.audioObj.pause();
  }

  public stop() {
    this.stopAudio.next();
  }

  public seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  public formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  public getState(): Observable<AudioStates> {
    return this.stateChange.asObservable();
  }
}
