
// This is an interface where we can define the states of the track

export interface AudioStates {
    playing: boolean;
    displayCurrentTime: string;
    displayDuration: string;
    duration: number | undefined;
    currentTime: number | undefined;
    canplay: boolean;
    error: boolean;
}
