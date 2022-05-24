import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { AudioStates } from 'src/app/interfaces/audio-states';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent implements OnInit {
  state: AudioStates | undefined;
  currentFile: any = {};
  initialTrack: Boolean = true;
  isPlayerMaximized: Boolean = false;

  constructor(public audioService: AudioService) {
    this.audioService.getState()
    .subscribe(state => {
      this.state = state;
    });
  }

  ngOnInit(): void {
    this.openFile(this.audioService.files[0], 0, true);
  }

  playAudioStream(url: any) {
    this.audioService.playAudio(url)
    .subscribe(events => {
    });
  }

  // This function opens the audio track selected and starts playing

  openFile(file: { url: any; }, index: number, pause?: Boolean) {
    this.currentFile = { index, file };
      this.audioService.stop();
      this.playAudioStream(file.url);  
      this.initialTrack = false;
      if(pause) {
        this.audioService.pause();
      }
  }

  // This function plays the next track in the list and is triggered upon clicking next button in the player toolbar

  next() {
    let index;
    if(this.currentFile.index + 1 >= this.audioService.files.length) {
      index = 0;
    } else {
      index = this.currentFile.index + 1;
    }
    const file = this.audioService.files[index];
    this.openFile(file, index);
  }

  // This function plays the previous track in the list and is triggered upon clicking previous button in the player toolbar

  previous() {
    let index;
    if(this.currentFile.index - 1 <= 0) {
      index = this.audioService.files.length - 1;
    } else {
      index = this.currentFile.index - 1;
    }
    const file = this.audioService.files[index];
    this.openFile(file, index);
  }

  // This function manages to select or slide the player to desired time

  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }

  // This function toggles the view of player (Full screen view or list view)
  
  maximizePlayer() {
    this.isPlayerMaximized = !this.isPlayerMaximized;
  }

}
