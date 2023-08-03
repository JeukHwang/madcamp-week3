import { useEffect } from 'react'
import { Howl } from 'howler';

function useSound(src: any, volume = 1, fadeoutTime = 0) {
    let sound: { stop: () => any; volume: (arg0: number) => void; play: () => void; on: (arg0: string, arg1: () => void) => void; fade: (arg0: number, arg1: number, arg2: number) => void; duration: () => number; seek: () => number; };
    const soundStop = () => sound.stop();
    const soundPlay = (src: any) => {
        sound = new Howl({ src });
        sound.volume(volume);
        sound.play();
    }

    useEffect(() => {
        soundPlay(src);
        sound.on('play', () => {
            const fadeouttime = fadeoutTime;
            setTimeout(() => sound.fade(volume, 0, fadeouttime), (sound.duration() - sound.seek()) * 1000 - fadeouttime);
        });
        return soundStop;
    }, []);
}

export default useSound;