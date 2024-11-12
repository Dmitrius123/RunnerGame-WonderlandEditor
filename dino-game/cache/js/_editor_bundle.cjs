(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };

  // node_modules/howler/dist/howler.js
  var require_howler = __commonJS({
    "node_modules/howler/dist/howler.js"(exports) {
      (function() {
        "use strict";
        var HowlerGlobal2 = function() {
          this.init();
        };
        HowlerGlobal2.prototype = {
          /**
           * Initialize the global Howler object.
           * @return {Howler}
           */
          init: function() {
            var self2 = this || Howler2;
            self2._counter = 1e3;
            self2._html5AudioPool = [];
            self2.html5PoolSize = 10;
            self2._codecs = {};
            self2._howls = [];
            self2._muted = false;
            self2._volume = 1;
            self2._canPlayEvent = "canplaythrough";
            self2._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
            self2.masterGain = null;
            self2.noAudio = false;
            self2.usingWebAudio = true;
            self2.autoSuspend = true;
            self2.ctx = null;
            self2.autoUnlock = true;
            self2._setup();
            return self2;
          },
          /**
           * Get/set the global volume for all sounds.
           * @param  {Float} vol Volume from 0.0 to 1.0.
           * @return {Howler/Float}     Returns self or current volume.
           */
          volume: function(vol) {
            var self2 = this || Howler2;
            vol = parseFloat(vol);
            if (!self2.ctx) {
              setupAudioContext();
            }
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              self2._volume = vol;
              if (self2._muted) {
                return self2;
              }
              if (self2.usingWebAudio) {
                self2.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              }
              for (var i = 0; i < self2._howls.length; i++) {
                if (!self2._howls[i]._webAudio) {
                  var ids = self2._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self2._howls[i]._soundById(ids[j]);
                    if (sound && sound._node) {
                      sound._node.volume = sound._volume * vol;
                    }
                  }
                }
              }
              return self2;
            }
            return self2._volume;
          },
          /**
           * Handle muting and unmuting globally.
           * @param  {Boolean} muted Is muted or not.
           */
          mute: function(muted) {
            var self2 = this || Howler2;
            if (!self2.ctx) {
              setupAudioContext();
            }
            self2._muted = muted;
            if (self2.usingWebAudio) {
              self2.masterGain.gain.setValueAtTime(muted ? 0 : self2._volume, Howler2.ctx.currentTime);
            }
            for (var i = 0; i < self2._howls.length; i++) {
              if (!self2._howls[i]._webAudio) {
                var ids = self2._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self2._howls[i]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.muted = muted ? true : sound._muted;
                  }
                }
              }
            }
            return self2;
          },
          /**
           * Handle stopping all sounds globally.
           */
          stop: function() {
            var self2 = this || Howler2;
            for (var i = 0; i < self2._howls.length; i++) {
              self2._howls[i].stop();
            }
            return self2;
          },
          /**
           * Unload and destroy all currently loaded Howl objects.
           * @return {Howler}
           */
          unload: function() {
            var self2 = this || Howler2;
            for (var i = self2._howls.length - 1; i >= 0; i--) {
              self2._howls[i].unload();
            }
            if (self2.usingWebAudio && self2.ctx && typeof self2.ctx.close !== "undefined") {
              self2.ctx.close();
              self2.ctx = null;
              setupAudioContext();
            }
            return self2;
          },
          /**
           * Check for codec support of specific extension.
           * @param  {String} ext Audio file extention.
           * @return {Boolean}
           */
          codecs: function(ext) {
            return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
          },
          /**
           * Setup various state values for global tracking.
           * @return {Howler}
           */
          _setup: function() {
            var self2 = this || Howler2;
            self2.state = self2.ctx ? self2.ctx.state || "suspended" : "suspended";
            self2._autoSuspend();
            if (!self2.usingWebAudio) {
              if (typeof Audio !== "undefined") {
                try {
                  var test = new Audio();
                  if (typeof test.oncanplaythrough === "undefined") {
                    self2._canPlayEvent = "canplay";
                  }
                } catch (e) {
                  self2.noAudio = true;
                }
              } else {
                self2.noAudio = true;
              }
            }
            try {
              var test = new Audio();
              if (test.muted) {
                self2.noAudio = true;
              }
            } catch (e) {
            }
            if (!self2.noAudio) {
              self2._setupCodecs();
            }
            return self2;
          },
          /**
           * Check for browser support for various codecs and cache the results.
           * @return {Howler}
           */
          _setupCodecs: function() {
            var self2 = this || Howler2;
            var audioTest = null;
            try {
              audioTest = typeof Audio !== "undefined" ? new Audio() : null;
            } catch (err) {
              return self2;
            }
            if (!audioTest || typeof audioTest.canPlayType !== "function") {
              return self2;
            }
            var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
            var ua = self2._navigator ? self2._navigator.userAgent : "";
            var checkOpera = ua.match(/OPR\/([0-6].)/g);
            var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
            var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
            var safariVersion = ua.match(/Version\/(.*?) /);
            var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
            self2._codecs = {
              mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
              mpeg: !!mpegTest,
              opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
              ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
              aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
              caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
              m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
              flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
            };
            return self2;
          },
          /**
           * Some browsers/devices will only allow audio to be played after a user interaction.
           * Attempt to automatically unlock audio on the first user interaction.
           * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
           * @return {Howler}
           */
          _unlockAudio: function() {
            var self2 = this || Howler2;
            if (self2._audioUnlocked || !self2.ctx) {
              return;
            }
            self2._audioUnlocked = false;
            self2.autoUnlock = false;
            if (!self2._mobileUnloaded && self2.ctx.sampleRate !== 44100) {
              self2._mobileUnloaded = true;
              self2.unload();
            }
            self2._scratchBuffer = self2.ctx.createBuffer(1, 1, 22050);
            var unlock = function(e) {
              while (self2._html5AudioPool.length < self2.html5PoolSize) {
                try {
                  var audioNode = new Audio();
                  audioNode._unlocked = true;
                  self2._releaseHtml5Audio(audioNode);
                } catch (e2) {
                  self2.noAudio = true;
                  break;
                }
              }
              for (var i = 0; i < self2._howls.length; i++) {
                if (!self2._howls[i]._webAudio) {
                  var ids = self2._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self2._howls[i]._soundById(ids[j]);
                    if (sound && sound._node && !sound._node._unlocked) {
                      sound._node._unlocked = true;
                      sound._node.load();
                    }
                  }
                }
              }
              self2._autoResume();
              var source = self2.ctx.createBufferSource();
              source.buffer = self2._scratchBuffer;
              source.connect(self2.ctx.destination);
              if (typeof source.start === "undefined") {
                source.noteOn(0);
              } else {
                source.start(0);
              }
              if (typeof self2.ctx.resume === "function") {
                self2.ctx.resume();
              }
              source.onended = function() {
                source.disconnect(0);
                self2._audioUnlocked = true;
                document.removeEventListener("touchstart", unlock, true);
                document.removeEventListener("touchend", unlock, true);
                document.removeEventListener("click", unlock, true);
                document.removeEventListener("keydown", unlock, true);
                for (var i2 = 0; i2 < self2._howls.length; i2++) {
                  self2._howls[i2]._emit("unlock");
                }
              };
            };
            document.addEventListener("touchstart", unlock, true);
            document.addEventListener("touchend", unlock, true);
            document.addEventListener("click", unlock, true);
            document.addEventListener("keydown", unlock, true);
            return self2;
          },
          /**
           * Get an unlocked HTML5 Audio object from the pool. If none are left,
           * return a new Audio object and throw a warning.
           * @return {Audio} HTML5 Audio object.
           */
          _obtainHtml5Audio: function() {
            var self2 = this || Howler2;
            if (self2._html5AudioPool.length) {
              return self2._html5AudioPool.pop();
            }
            var testPlay = new Audio().play();
            if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
              testPlay.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
              });
            }
            return new Audio();
          },
          /**
           * Return an activated HTML5 Audio object to the pool.
           * @return {Howler}
           */
          _releaseHtml5Audio: function(audio) {
            var self2 = this || Howler2;
            if (audio._unlocked) {
              self2._html5AudioPool.push(audio);
            }
            return self2;
          },
          /**
           * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
           * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
           * @return {Howler}
           */
          _autoSuspend: function() {
            var self2 = this;
            if (!self2.autoSuspend || !self2.ctx || typeof self2.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            for (var i = 0; i < self2._howls.length; i++) {
              if (self2._howls[i]._webAudio) {
                for (var j = 0; j < self2._howls[i]._sounds.length; j++) {
                  if (!self2._howls[i]._sounds[j]._paused) {
                    return self2;
                  }
                }
              }
            }
            if (self2._suspendTimer) {
              clearTimeout(self2._suspendTimer);
            }
            self2._suspendTimer = setTimeout(function() {
              if (!self2.autoSuspend) {
                return;
              }
              self2._suspendTimer = null;
              self2.state = "suspending";
              var handleSuspension = function() {
                self2.state = "suspended";
                if (self2._resumeAfterSuspend) {
                  delete self2._resumeAfterSuspend;
                  self2._autoResume();
                }
              };
              self2.ctx.suspend().then(handleSuspension, handleSuspension);
            }, 3e4);
            return self2;
          },
          /**
           * Automatically resume the Web Audio AudioContext when a new sound is played.
           * @return {Howler}
           */
          _autoResume: function() {
            var self2 = this;
            if (!self2.ctx || typeof self2.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            if (self2.state === "running" && self2.ctx.state !== "interrupted" && self2._suspendTimer) {
              clearTimeout(self2._suspendTimer);
              self2._suspendTimer = null;
            } else if (self2.state === "suspended" || self2.state === "running" && self2.ctx.state === "interrupted") {
              self2.ctx.resume().then(function() {
                self2.state = "running";
                for (var i = 0; i < self2._howls.length; i++) {
                  self2._howls[i]._emit("resume");
                }
              });
              if (self2._suspendTimer) {
                clearTimeout(self2._suspendTimer);
                self2._suspendTimer = null;
              }
            } else if (self2.state === "suspending") {
              self2._resumeAfterSuspend = true;
            }
            return self2;
          }
        };
        var Howler2 = new HowlerGlobal2();
        var Howl2 = function(o) {
          var self2 = this;
          if (!o.src || o.src.length === 0) {
            console.error("An array of source files must be passed with any new Howl.");
            return;
          }
          self2.init(o);
        };
        Howl2.prototype = {
          /**
           * Initialize a new Howl group object.
           * @param  {Object} o Passed in properties for this group.
           * @return {Howl}
           */
          init: function(o) {
            var self2 = this;
            if (!Howler2.ctx) {
              setupAudioContext();
            }
            self2._autoplay = o.autoplay || false;
            self2._format = typeof o.format !== "string" ? o.format : [o.format];
            self2._html5 = o.html5 || false;
            self2._muted = o.mute || false;
            self2._loop = o.loop || false;
            self2._pool = o.pool || 5;
            self2._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
            self2._rate = o.rate || 1;
            self2._sprite = o.sprite || {};
            self2._src = typeof o.src !== "string" ? o.src : [o.src];
            self2._volume = o.volume !== void 0 ? o.volume : 1;
            self2._xhr = {
              method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
              headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
              withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
            };
            self2._duration = 0;
            self2._state = "unloaded";
            self2._sounds = [];
            self2._endTimers = {};
            self2._queue = [];
            self2._playLock = false;
            self2._onend = o.onend ? [{ fn: o.onend }] : [];
            self2._onfade = o.onfade ? [{ fn: o.onfade }] : [];
            self2._onload = o.onload ? [{ fn: o.onload }] : [];
            self2._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
            self2._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
            self2._onpause = o.onpause ? [{ fn: o.onpause }] : [];
            self2._onplay = o.onplay ? [{ fn: o.onplay }] : [];
            self2._onstop = o.onstop ? [{ fn: o.onstop }] : [];
            self2._onmute = o.onmute ? [{ fn: o.onmute }] : [];
            self2._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
            self2._onrate = o.onrate ? [{ fn: o.onrate }] : [];
            self2._onseek = o.onseek ? [{ fn: o.onseek }] : [];
            self2._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
            self2._onresume = [];
            self2._webAudio = Howler2.usingWebAudio && !self2._html5;
            if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
              Howler2._unlockAudio();
            }
            Howler2._howls.push(self2);
            if (self2._autoplay) {
              self2._queue.push({
                event: "play",
                action: function() {
                  self2.play();
                }
              });
            }
            if (self2._preload && self2._preload !== "none") {
              self2.load();
            }
            return self2;
          },
          /**
           * Load the audio file.
           * @return {Howler}
           */
          load: function() {
            var self2 = this;
            var url = null;
            if (Howler2.noAudio) {
              self2._emit("loaderror", null, "No audio support.");
              return;
            }
            if (typeof self2._src === "string") {
              self2._src = [self2._src];
            }
            for (var i = 0; i < self2._src.length; i++) {
              var ext, str5;
              if (self2._format && self2._format[i]) {
                ext = self2._format[i];
              } else {
                str5 = self2._src[i];
                if (typeof str5 !== "string") {
                  self2._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                  continue;
                }
                ext = /^data:audio\/([^;,]+);/i.exec(str5);
                if (!ext) {
                  ext = /\.([^.]+)$/.exec(str5.split("?", 1)[0]);
                }
                if (ext) {
                  ext = ext[1].toLowerCase();
                }
              }
              if (!ext) {
                console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
              }
              if (ext && Howler2.codecs(ext)) {
                url = self2._src[i];
                break;
              }
            }
            if (!url) {
              self2._emit("loaderror", null, "No codec support for selected audio sources.");
              return;
            }
            self2._src = url;
            self2._state = "loading";
            if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
              self2._html5 = true;
              self2._webAudio = false;
            }
            new Sound2(self2);
            if (self2._webAudio) {
              loadBuffer(self2);
            }
            return self2;
          },
          /**
           * Play a sound or resume previous playback.
           * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Number}          Sound ID.
           */
          play: function(sprite, internal) {
            var self2 = this;
            var id = null;
            if (typeof sprite === "number") {
              id = sprite;
              sprite = null;
            } else if (typeof sprite === "string" && self2._state === "loaded" && !self2._sprite[sprite]) {
              return null;
            } else if (typeof sprite === "undefined") {
              sprite = "__default";
              if (!self2._playLock) {
                var num = 0;
                for (var i = 0; i < self2._sounds.length; i++) {
                  if (self2._sounds[i]._paused && !self2._sounds[i]._ended) {
                    num++;
                    id = self2._sounds[i]._id;
                  }
                }
                if (num === 1) {
                  sprite = null;
                } else {
                  id = null;
                }
              }
            }
            var sound = id ? self2._soundById(id) : self2._inactiveSound();
            if (!sound) {
              return null;
            }
            if (id && !sprite) {
              sprite = sound._sprite || "__default";
            }
            if (self2._state !== "loaded") {
              sound._sprite = sprite;
              sound._ended = false;
              var soundId = sound._id;
              self2._queue.push({
                event: "play",
                action: function() {
                  self2.play(soundId);
                }
              });
              return soundId;
            }
            if (id && !sound._paused) {
              if (!internal) {
                self2._loadQueue("play");
              }
              return sound._id;
            }
            if (self2._webAudio) {
              Howler2._autoResume();
            }
            var seek = Math.max(0, sound._seek > 0 ? sound._seek : self2._sprite[sprite][0] / 1e3);
            var duration = Math.max(0, (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3 - seek);
            var timeout = duration * 1e3 / Math.abs(sound._rate);
            var start = self2._sprite[sprite][0] / 1e3;
            var stop = (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3;
            sound._sprite = sprite;
            sound._ended = false;
            var setParams = function() {
              sound._paused = false;
              sound._seek = seek;
              sound._start = start;
              sound._stop = stop;
              sound._loop = !!(sound._loop || self2._sprite[sprite][2]);
            };
            if (seek >= stop) {
              self2._ended(sound);
              return;
            }
            var node = sound._node;
            if (self2._webAudio) {
              var playWebAudio = function() {
                self2._playLock = false;
                setParams();
                self2._refreshBuffer(sound);
                var vol = sound._muted || self2._muted ? 0 : sound._volume;
                node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                sound._playStart = Howler2.ctx.currentTime;
                if (typeof node.bufferSource.start === "undefined") {
                  sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
                } else {
                  sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
                }
                if (timeout !== Infinity) {
                  self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
                }
                if (!internal) {
                  setTimeout(function() {
                    self2._emit("play", sound._id);
                    self2._loadQueue();
                  }, 0);
                }
              };
              if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
                playWebAudio();
              } else {
                self2._playLock = true;
                self2.once("resume", playWebAudio);
                self2._clearTimer(sound._id);
              }
            } else {
              var playHtml5 = function() {
                node.currentTime = seek;
                node.muted = sound._muted || self2._muted || Howler2._muted || node.muted;
                node.volume = sound._volume * Howler2.volume();
                node.playbackRate = sound._rate;
                try {
                  var play = node.play();
                  if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                    self2._playLock = true;
                    setParams();
                    play.then(function() {
                      self2._playLock = false;
                      node._unlocked = true;
                      if (!internal) {
                        self2._emit("play", sound._id);
                      } else {
                        self2._loadQueue();
                      }
                    }).catch(function() {
                      self2._playLock = false;
                      self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                      sound._ended = true;
                      sound._paused = true;
                    });
                  } else if (!internal) {
                    self2._playLock = false;
                    setParams();
                    self2._emit("play", sound._id);
                  }
                  node.playbackRate = sound._rate;
                  if (node.paused) {
                    self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    return;
                  }
                  if (sprite !== "__default" || sound._loop) {
                    self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
                  } else {
                    self2._endTimers[sound._id] = function() {
                      self2._ended(sound);
                      node.removeEventListener("ended", self2._endTimers[sound._id], false);
                    };
                    node.addEventListener("ended", self2._endTimers[sound._id], false);
                  }
                } catch (err) {
                  self2._emit("playerror", sound._id, err);
                }
              };
              if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
                node.src = self2._src;
                node.load();
              }
              var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
              if (node.readyState >= 3 || loadedNoReadyState) {
                playHtml5();
              } else {
                self2._playLock = true;
                self2._state = "loading";
                var listener = function() {
                  self2._state = "loaded";
                  playHtml5();
                  node.removeEventListener(Howler2._canPlayEvent, listener, false);
                };
                node.addEventListener(Howler2._canPlayEvent, listener, false);
                self2._clearTimer(sound._id);
              }
            }
            return sound._id;
          },
          /**
           * Pause playback and save current position.
           * @param  {Number} id The sound ID (empty to pause all in group).
           * @return {Howl}
           */
          pause: function(id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "pause",
                action: function() {
                  self2.pause(id);
                }
              });
              return self2;
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self2._clearTimer(ids[i]);
              var sound = self2._soundById(ids[i]);
              if (sound && !sound._paused) {
                sound._seek = self2.seek(ids[i]);
                sound._rateSeek = 0;
                sound._paused = true;
                self2._stopFade(ids[i]);
                if (sound._node) {
                  if (self2._webAudio) {
                    if (!sound._node.bufferSource) {
                      continue;
                    }
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self2._cleanBuffer(sound._node);
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.pause();
                  }
                }
              }
              if (!arguments[1]) {
                self2._emit("pause", sound ? sound._id : null);
              }
            }
            return self2;
          },
          /**
           * Stop playback and reset to start.
           * @param  {Number} id The sound ID (empty to stop all in group).
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Howl}
           */
          stop: function(id, internal) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "stop",
                action: function() {
                  self2.stop(id);
                }
              });
              return self2;
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self2._clearTimer(ids[i]);
              var sound = self2._soundById(ids[i]);
              if (sound) {
                sound._seek = sound._start || 0;
                sound._rateSeek = 0;
                sound._paused = true;
                sound._ended = true;
                self2._stopFade(ids[i]);
                if (sound._node) {
                  if (self2._webAudio) {
                    if (sound._node.bufferSource) {
                      if (typeof sound._node.bufferSource.stop === "undefined") {
                        sound._node.bufferSource.noteOff(0);
                      } else {
                        sound._node.bufferSource.stop(0);
                      }
                      self2._cleanBuffer(sound._node);
                    }
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.currentTime = sound._start || 0;
                    sound._node.pause();
                    if (sound._node.duration === Infinity) {
                      self2._clearSound(sound._node);
                    }
                  }
                }
                if (!internal) {
                  self2._emit("stop", sound._id);
                }
              }
            }
            return self2;
          },
          /**
           * Mute/unmute a single sound or all sounds in this Howl group.
           * @param  {Boolean} muted Set to true to mute and false to unmute.
           * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
           * @return {Howl}
           */
          mute: function(muted, id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "mute",
                action: function() {
                  self2.mute(muted, id);
                }
              });
              return self2;
            }
            if (typeof id === "undefined") {
              if (typeof muted === "boolean") {
                self2._muted = muted;
              } else {
                return self2._muted;
              }
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self2._soundById(ids[i]);
              if (sound) {
                sound._muted = muted;
                if (sound._interval) {
                  self2._stopFade(sound._id);
                }
                if (self2._webAudio && sound._node) {
                  sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.muted = Howler2._muted ? true : muted;
                }
                self2._emit("mute", sound._id);
              }
            }
            return self2;
          },
          /**
           * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
           *   volume() -> Returns the group's volume value.
           *   volume(id) -> Returns the sound id's current volume.
           *   volume(vol) -> Sets the volume of all sounds in this Howl group.
           *   volume(vol, id) -> Sets the volume of passed sound id.
           * @return {Howl/Number} Returns self or current volume.
           */
          volume: function() {
            var self2 = this;
            var args = arguments;
            var vol, id;
            if (args.length === 0) {
              return self2._volume;
            } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                vol = parseFloat(args[0]);
              }
            } else if (args.length >= 2) {
              vol = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              if (self2._state !== "loaded" || self2._playLock) {
                self2._queue.push({
                  event: "volume",
                  action: function() {
                    self2.volume.apply(self2, args);
                  }
                });
                return self2;
              }
              if (typeof id === "undefined") {
                self2._volume = vol;
              }
              id = self2._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self2._soundById(id[i]);
                if (sound) {
                  sound._volume = vol;
                  if (!args[2]) {
                    self2._stopFade(id[i]);
                  }
                  if (self2._webAudio && sound._node && !sound._muted) {
                    sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                  } else if (sound._node && !sound._muted) {
                    sound._node.volume = vol * Howler2.volume();
                  }
                  self2._emit("volume", sound._id);
                }
              }
            } else {
              sound = id ? self2._soundById(id) : self2._sounds[0];
              return sound ? sound._volume : 0;
            }
            return self2;
          },
          /**
           * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id (omit to fade all sounds).
           * @return {Howl}
           */
          fade: function(from, to, len4, id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "fade",
                action: function() {
                  self2.fade(from, to, len4, id);
                }
              });
              return self2;
            }
            from = Math.min(Math.max(0, parseFloat(from)), 1);
            to = Math.min(Math.max(0, parseFloat(to)), 1);
            len4 = parseFloat(len4);
            self2.volume(from, id);
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self2._soundById(ids[i]);
              if (sound) {
                if (!id) {
                  self2._stopFade(ids[i]);
                }
                if (self2._webAudio && !sound._muted) {
                  var currentTime = Howler2.ctx.currentTime;
                  var end = currentTime + len4 / 1e3;
                  sound._volume = from;
                  sound._node.gain.setValueAtTime(from, currentTime);
                  sound._node.gain.linearRampToValueAtTime(to, end);
                }
                self2._startFadeInterval(sound, from, to, len4, ids[i], typeof id === "undefined");
              }
            }
            return self2;
          },
          /**
           * Starts the internal interval to fade a sound.
           * @param  {Object} sound Reference to sound to fade.
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id to fade.
           * @param  {Boolean} isGroup   If true, set the volume on the group.
           */
          _startFadeInterval: function(sound, from, to, len4, id, isGroup) {
            var self2 = this;
            var vol = from;
            var diff = to - from;
            var steps = Math.abs(diff / 0.01);
            var stepLen = Math.max(4, steps > 0 ? len4 / steps : len4);
            var lastTick = Date.now();
            sound._fadeTo = to;
            sound._interval = setInterval(function() {
              var tick = (Date.now() - lastTick) / len4;
              lastTick = Date.now();
              vol += diff * tick;
              vol = Math.round(vol * 100) / 100;
              if (diff < 0) {
                vol = Math.max(to, vol);
              } else {
                vol = Math.min(to, vol);
              }
              if (self2._webAudio) {
                sound._volume = vol;
              } else {
                self2.volume(vol, sound._id, true);
              }
              if (isGroup) {
                self2._volume = vol;
              }
              if (to < from && vol <= to || to > from && vol >= to) {
                clearInterval(sound._interval);
                sound._interval = null;
                sound._fadeTo = null;
                self2.volume(to, sound._id);
                self2._emit("fade", sound._id);
              }
            }, stepLen);
          },
          /**
           * Internal method that stops the currently playing fade when
           * a new fade starts, volume is changed or the sound is stopped.
           * @param  {Number} id The sound id.
           * @return {Howl}
           */
          _stopFade: function(id) {
            var self2 = this;
            var sound = self2._soundById(id);
            if (sound && sound._interval) {
              if (self2._webAudio) {
                sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
              }
              clearInterval(sound._interval);
              sound._interval = null;
              self2.volume(sound._fadeTo, id);
              sound._fadeTo = null;
              self2._emit("fade", id);
            }
            return self2;
          },
          /**
           * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
           *   loop() -> Returns the group's loop value.
           *   loop(id) -> Returns the sound id's loop value.
           *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
           *   loop(loop, id) -> Sets the loop value of passed sound id.
           * @return {Howl/Boolean} Returns self or current loop value.
           */
          loop: function() {
            var self2 = this;
            var args = arguments;
            var loop, id, sound;
            if (args.length === 0) {
              return self2._loop;
            } else if (args.length === 1) {
              if (typeof args[0] === "boolean") {
                loop = args[0];
                self2._loop = loop;
              } else {
                sound = self2._soundById(parseInt(args[0], 10));
                return sound ? sound._loop : false;
              }
            } else if (args.length === 2) {
              loop = args[0];
              id = parseInt(args[1], 10);
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              sound = self2._soundById(ids[i]);
              if (sound) {
                sound._loop = loop;
                if (self2._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.loop = loop;
                  if (loop) {
                    sound._node.bufferSource.loopStart = sound._start || 0;
                    sound._node.bufferSource.loopEnd = sound._stop;
                    if (self2.playing(ids[i])) {
                      self2.pause(ids[i], true);
                      self2.play(ids[i], true);
                    }
                  }
                }
              }
            }
            return self2;
          },
          /**
           * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   rate() -> Returns the first sound node's current playback rate.
           *   rate(id) -> Returns the sound id's current playback rate.
           *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
           *   rate(rate, id) -> Sets the playback rate of passed sound id.
           * @return {Howl/Number} Returns self or the current playback rate.
           */
          rate: function() {
            var self2 = this;
            var args = arguments;
            var rate, id;
            if (args.length === 0) {
              id = self2._sounds[0]._id;
            } else if (args.length === 1) {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                rate = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              rate = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof rate === "number") {
              if (self2._state !== "loaded" || self2._playLock) {
                self2._queue.push({
                  event: "rate",
                  action: function() {
                    self2.rate.apply(self2, args);
                  }
                });
                return self2;
              }
              if (typeof id === "undefined") {
                self2._rate = rate;
              }
              id = self2._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self2._soundById(id[i]);
                if (sound) {
                  if (self2.playing(id[i])) {
                    sound._rateSeek = self2.seek(id[i]);
                    sound._playStart = self2._webAudio ? Howler2.ctx.currentTime : sound._playStart;
                  }
                  sound._rate = rate;
                  if (self2._webAudio && sound._node && sound._node.bufferSource) {
                    sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                  } else if (sound._node) {
                    sound._node.playbackRate = rate;
                  }
                  var seek = self2.seek(id[i]);
                  var duration = (self2._sprite[sound._sprite][0] + self2._sprite[sound._sprite][1]) / 1e3 - seek;
                  var timeout = duration * 1e3 / Math.abs(sound._rate);
                  if (self2._endTimers[id[i]] || !sound._paused) {
                    self2._clearTimer(id[i]);
                    self2._endTimers[id[i]] = setTimeout(self2._ended.bind(self2, sound), timeout);
                  }
                  self2._emit("rate", sound._id);
                }
              }
            } else {
              sound = self2._soundById(id);
              return sound ? sound._rate : self2._rate;
            }
            return self2;
          },
          /**
           * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   seek() -> Returns the first sound node's current seek position.
           *   seek(id) -> Returns the sound id's current seek position.
           *   seek(seek) -> Sets the seek position of the first sound node.
           *   seek(seek, id) -> Sets the seek position of passed sound id.
           * @return {Howl/Number} Returns self or the current seek position.
           */
          seek: function() {
            var self2 = this;
            var args = arguments;
            var seek, id;
            if (args.length === 0) {
              if (self2._sounds.length) {
                id = self2._sounds[0]._id;
              }
            } else if (args.length === 1) {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else if (self2._sounds.length) {
                id = self2._sounds[0]._id;
                seek = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              seek = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            if (typeof id === "undefined") {
              return 0;
            }
            if (typeof seek === "number" && (self2._state !== "loaded" || self2._playLock)) {
              self2._queue.push({
                event: "seek",
                action: function() {
                  self2.seek.apply(self2, args);
                }
              });
              return self2;
            }
            var sound = self2._soundById(id);
            if (sound) {
              if (typeof seek === "number" && seek >= 0) {
                var playing = self2.playing(id);
                if (playing) {
                  self2.pause(id, true);
                }
                sound._seek = seek;
                sound._ended = false;
                self2._clearTimer(id);
                if (!self2._webAudio && sound._node && !isNaN(sound._node.duration)) {
                  sound._node.currentTime = seek;
                }
                var seekAndEmit = function() {
                  if (playing) {
                    self2.play(id, true);
                  }
                  self2._emit("seek", id);
                };
                if (playing && !self2._webAudio) {
                  var emitSeek = function() {
                    if (!self2._playLock) {
                      seekAndEmit();
                    } else {
                      setTimeout(emitSeek, 0);
                    }
                  };
                  setTimeout(emitSeek, 0);
                } else {
                  seekAndEmit();
                }
              } else {
                if (self2._webAudio) {
                  var realTime = self2.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
                  var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                  return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
                } else {
                  return sound._node.currentTime;
                }
              }
            }
            return self2;
          },
          /**
           * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
           * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
           * @return {Boolean} True if playing and false if not.
           */
          playing: function(id) {
            var self2 = this;
            if (typeof id === "number") {
              var sound = self2._soundById(id);
              return sound ? !sound._paused : false;
            }
            for (var i = 0; i < self2._sounds.length; i++) {
              if (!self2._sounds[i]._paused) {
                return true;
              }
            }
            return false;
          },
          /**
           * Get the duration of this sound. Passing a sound id will return the sprite duration.
           * @param  {Number} id The sound id to check. If none is passed, return full source duration.
           * @return {Number} Audio duration in seconds.
           */
          duration: function(id) {
            var self2 = this;
            var duration = self2._duration;
            var sound = self2._soundById(id);
            if (sound) {
              duration = self2._sprite[sound._sprite][1] / 1e3;
            }
            return duration;
          },
          /**
           * Returns the current loaded state of this Howl.
           * @return {String} 'unloaded', 'loading', 'loaded'
           */
          state: function() {
            return this._state;
          },
          /**
           * Unload and destroy the current Howl object.
           * This will immediately stop all sound instances attached to this group.
           */
          unload: function() {
            var self2 = this;
            var sounds = self2._sounds;
            for (var i = 0; i < sounds.length; i++) {
              if (!sounds[i]._paused) {
                self2.stop(sounds[i]._id);
              }
              if (!self2._webAudio) {
                self2._clearSound(sounds[i]._node);
                sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
                sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
                sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
                Howler2._releaseHtml5Audio(sounds[i]._node);
              }
              delete sounds[i]._node;
              self2._clearTimer(sounds[i]._id);
            }
            var index = Howler2._howls.indexOf(self2);
            if (index >= 0) {
              Howler2._howls.splice(index, 1);
            }
            var remCache = true;
            for (i = 0; i < Howler2._howls.length; i++) {
              if (Howler2._howls[i]._src === self2._src || self2._src.indexOf(Howler2._howls[i]._src) >= 0) {
                remCache = false;
                break;
              }
            }
            if (cache && remCache) {
              delete cache[self2._src];
            }
            Howler2.noAudio = false;
            self2._state = "unloaded";
            self2._sounds = [];
            self2 = null;
            return null;
          },
          /**
           * Listen to a custom event.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
           * @return {Howl}
           */
          on: function(event, fn, id, once) {
            var self2 = this;
            var events = self2["_on" + event];
            if (typeof fn === "function") {
              events.push(once ? { id, fn, once } : { id, fn });
            }
            return self2;
          },
          /**
           * Remove a custom event. Call without parameters to remove all events.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to remove. Leave empty to remove all.
           * @param  {Number}   id    (optional) Only remove events for this sound.
           * @return {Howl}
           */
          off: function(event, fn, id) {
            var self2 = this;
            var events = self2["_on" + event];
            var i = 0;
            if (typeof fn === "number") {
              id = fn;
              fn = null;
            }
            if (fn || id) {
              for (i = 0; i < events.length; i++) {
                var isId = id === events[i].id;
                if (fn === events[i].fn && isId || !fn && isId) {
                  events.splice(i, 1);
                  break;
                }
              }
            } else if (event) {
              self2["_on" + event] = [];
            } else {
              var keys = Object.keys(self2);
              for (i = 0; i < keys.length; i++) {
                if (keys[i].indexOf("_on") === 0 && Array.isArray(self2[keys[i]])) {
                  self2[keys[i]] = [];
                }
              }
            }
            return self2;
          },
          /**
           * Listen to a custom event and remove it once fired.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @return {Howl}
           */
          once: function(event, fn, id) {
            var self2 = this;
            self2.on(event, fn, id, 1);
            return self2;
          },
          /**
           * Emit all events of a specific type and pass the sound id.
           * @param  {String} event Event name.
           * @param  {Number} id    Sound ID.
           * @param  {Number} msg   Message to go with event.
           * @return {Howl}
           */
          _emit: function(event, id, msg) {
            var self2 = this;
            var events = self2["_on" + event];
            for (var i = events.length - 1; i >= 0; i--) {
              if (!events[i].id || events[i].id === id || event === "load") {
                setTimeout(function(fn) {
                  fn.call(this, id, msg);
                }.bind(self2, events[i].fn), 0);
                if (events[i].once) {
                  self2.off(event, events[i].fn, events[i].id);
                }
              }
            }
            self2._loadQueue(event);
            return self2;
          },
          /**
           * Queue of actions initiated before the sound has loaded.
           * These will be called in sequence, with the next only firing
           * after the previous has finished executing (even if async like play).
           * @return {Howl}
           */
          _loadQueue: function(event) {
            var self2 = this;
            if (self2._queue.length > 0) {
              var task = self2._queue[0];
              if (task.event === event) {
                self2._queue.shift();
                self2._loadQueue();
              }
              if (!event) {
                task.action();
              }
            }
            return self2;
          },
          /**
           * Fired when playback ends at the end of the duration.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _ended: function(sound) {
            var self2 = this;
            var sprite = sound._sprite;
            if (!self2._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
              setTimeout(self2._ended.bind(self2, sound), 100);
              return self2;
            }
            var loop = !!(sound._loop || self2._sprite[sprite][2]);
            self2._emit("end", sound._id);
            if (!self2._webAudio && loop) {
              self2.stop(sound._id, true).play(sound._id);
            }
            if (self2._webAudio && loop) {
              self2._emit("play", sound._id);
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._playStart = Howler2.ctx.currentTime;
              var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
              self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
            }
            if (self2._webAudio && !loop) {
              sound._paused = true;
              sound._ended = true;
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              self2._clearTimer(sound._id);
              self2._cleanBuffer(sound._node);
              Howler2._autoSuspend();
            }
            if (!self2._webAudio && !loop) {
              self2.stop(sound._id, true);
            }
            return self2;
          },
          /**
           * Clear the end timer for a sound playback.
           * @param  {Number} id The sound ID.
           * @return {Howl}
           */
          _clearTimer: function(id) {
            var self2 = this;
            if (self2._endTimers[id]) {
              if (typeof self2._endTimers[id] !== "function") {
                clearTimeout(self2._endTimers[id]);
              } else {
                var sound = self2._soundById(id);
                if (sound && sound._node) {
                  sound._node.removeEventListener("ended", self2._endTimers[id], false);
                }
              }
              delete self2._endTimers[id];
            }
            return self2;
          },
          /**
           * Return the sound identified by this ID, or return null.
           * @param  {Number} id Sound ID
           * @return {Object}    Sound object or null.
           */
          _soundById: function(id) {
            var self2 = this;
            for (var i = 0; i < self2._sounds.length; i++) {
              if (id === self2._sounds[i]._id) {
                return self2._sounds[i];
              }
            }
            return null;
          },
          /**
           * Return an inactive sound from the pool or create a new one.
           * @return {Sound} Sound playback object.
           */
          _inactiveSound: function() {
            var self2 = this;
            self2._drain();
            for (var i = 0; i < self2._sounds.length; i++) {
              if (self2._sounds[i]._ended) {
                return self2._sounds[i].reset();
              }
            }
            return new Sound2(self2);
          },
          /**
           * Drain excess inactive sounds from the pool.
           */
          _drain: function() {
            var self2 = this;
            var limit = self2._pool;
            var cnt = 0;
            var i = 0;
            if (self2._sounds.length < limit) {
              return;
            }
            for (i = 0; i < self2._sounds.length; i++) {
              if (self2._sounds[i]._ended) {
                cnt++;
              }
            }
            for (i = self2._sounds.length - 1; i >= 0; i--) {
              if (cnt <= limit) {
                return;
              }
              if (self2._sounds[i]._ended) {
                if (self2._webAudio && self2._sounds[i]._node) {
                  self2._sounds[i]._node.disconnect(0);
                }
                self2._sounds.splice(i, 1);
                cnt--;
              }
            }
          },
          /**
           * Get all ID's from the sounds pool.
           * @param  {Number} id Only return one ID if one is passed.
           * @return {Array}    Array of IDs.
           */
          _getSoundIds: function(id) {
            var self2 = this;
            if (typeof id === "undefined") {
              var ids = [];
              for (var i = 0; i < self2._sounds.length; i++) {
                ids.push(self2._sounds[i]._id);
              }
              return ids;
            } else {
              return [id];
            }
          },
          /**
           * Load the sound back into the buffer source.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _refreshBuffer: function(sound) {
            var self2 = this;
            sound._node.bufferSource = Howler2.ctx.createBufferSource();
            sound._node.bufferSource.buffer = cache[self2._src];
            if (sound._panner) {
              sound._node.bufferSource.connect(sound._panner);
            } else {
              sound._node.bufferSource.connect(sound._node);
            }
            sound._node.bufferSource.loop = sound._loop;
            if (sound._loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop || 0;
            }
            sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
            return self2;
          },
          /**
           * Prevent memory leaks by cleaning up the buffer source after playback.
           * @param  {Object} node Sound's audio node containing the buffer source.
           * @return {Howl}
           */
          _cleanBuffer: function(node) {
            var self2 = this;
            var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
            if (Howler2._scratchBuffer && node.bufferSource) {
              node.bufferSource.onended = null;
              node.bufferSource.disconnect(0);
              if (isIOS) {
                try {
                  node.bufferSource.buffer = Howler2._scratchBuffer;
                } catch (e) {
                }
              }
            }
            node.bufferSource = null;
            return self2;
          },
          /**
           * Set the source to a 0-second silence to stop any downloading (except in IE).
           * @param  {Object} node Audio node to clear.
           */
          _clearSound: function(node) {
            var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
            if (!checkIE) {
              node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            }
          }
        };
        var Sound2 = function(howl) {
          this._parent = howl;
          this.init();
        };
        Sound2.prototype = {
          /**
           * Initialize a new Sound object.
           * @return {Sound}
           */
          init: function() {
            var self2 = this;
            var parent = self2._parent;
            self2._muted = parent._muted;
            self2._loop = parent._loop;
            self2._volume = parent._volume;
            self2._rate = parent._rate;
            self2._seek = 0;
            self2._paused = true;
            self2._ended = true;
            self2._sprite = "__default";
            self2._id = ++Howler2._counter;
            parent._sounds.push(self2);
            self2.create();
            return self2;
          },
          /**
           * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
           * @return {Sound}
           */
          create: function() {
            var self2 = this;
            var parent = self2._parent;
            var volume = Howler2._muted || self2._muted || self2._parent._muted ? 0 : self2._volume;
            if (parent._webAudio) {
              self2._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
              self2._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
              self2._node.paused = true;
              self2._node.connect(Howler2.masterGain);
            } else if (!Howler2.noAudio) {
              self2._node = Howler2._obtainHtml5Audio();
              self2._errorFn = self2._errorListener.bind(self2);
              self2._node.addEventListener("error", self2._errorFn, false);
              self2._loadFn = self2._loadListener.bind(self2);
              self2._node.addEventListener(Howler2._canPlayEvent, self2._loadFn, false);
              self2._endFn = self2._endListener.bind(self2);
              self2._node.addEventListener("ended", self2._endFn, false);
              self2._node.src = parent._src;
              self2._node.preload = parent._preload === true ? "auto" : parent._preload;
              self2._node.volume = volume * Howler2.volume();
              self2._node.load();
            }
            return self2;
          },
          /**
           * Reset the parameters of this sound to the original state (for recycle).
           * @return {Sound}
           */
          reset: function() {
            var self2 = this;
            var parent = self2._parent;
            self2._muted = parent._muted;
            self2._loop = parent._loop;
            self2._volume = parent._volume;
            self2._rate = parent._rate;
            self2._seek = 0;
            self2._rateSeek = 0;
            self2._paused = true;
            self2._ended = true;
            self2._sprite = "__default";
            self2._id = ++Howler2._counter;
            return self2;
          },
          /**
           * HTML5 Audio error listener callback.
           */
          _errorListener: function() {
            var self2 = this;
            self2._parent._emit("loaderror", self2._id, self2._node.error ? self2._node.error.code : 0);
            self2._node.removeEventListener("error", self2._errorFn, false);
          },
          /**
           * HTML5 Audio canplaythrough listener callback.
           */
          _loadListener: function() {
            var self2 = this;
            var parent = self2._parent;
            parent._duration = Math.ceil(self2._node.duration * 10) / 10;
            if (Object.keys(parent._sprite).length === 0) {
              parent._sprite = { __default: [0, parent._duration * 1e3] };
            }
            if (parent._state !== "loaded") {
              parent._state = "loaded";
              parent._emit("load");
              parent._loadQueue();
            }
            self2._node.removeEventListener(Howler2._canPlayEvent, self2._loadFn, false);
          },
          /**
           * HTML5 Audio ended listener callback.
           */
          _endListener: function() {
            var self2 = this;
            var parent = self2._parent;
            if (parent._duration === Infinity) {
              parent._duration = Math.ceil(self2._node.duration * 10) / 10;
              if (parent._sprite.__default[1] === Infinity) {
                parent._sprite.__default[1] = parent._duration * 1e3;
              }
              parent._ended(self2);
            }
            self2._node.removeEventListener("ended", self2._endFn, false);
          }
        };
        var cache = {};
        var loadBuffer = function(self2) {
          var url = self2._src;
          if (cache[url]) {
            self2._duration = cache[url].duration;
            loadSound(self2);
            return;
          }
          if (/^data:[^;]+;base64,/.test(url)) {
            var data = atob(url.split(",")[1]);
            var dataView = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
              dataView[i] = data.charCodeAt(i);
            }
            decodeAudioData(dataView.buffer, self2);
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open(self2._xhr.method, url, true);
            xhr.withCredentials = self2._xhr.withCredentials;
            xhr.responseType = "arraybuffer";
            if (self2._xhr.headers) {
              Object.keys(self2._xhr.headers).forEach(function(key) {
                xhr.setRequestHeader(key, self2._xhr.headers[key]);
              });
            }
            xhr.onload = function() {
              var code = (xhr.status + "")[0];
              if (code !== "0" && code !== "2" && code !== "3") {
                self2._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
                return;
              }
              decodeAudioData(xhr.response, self2);
            };
            xhr.onerror = function() {
              if (self2._webAudio) {
                self2._html5 = true;
                self2._webAudio = false;
                self2._sounds = [];
                delete cache[url];
                self2.load();
              }
            };
            safeXhrSend(xhr);
          }
        };
        var safeXhrSend = function(xhr) {
          try {
            xhr.send();
          } catch (e) {
            xhr.onerror();
          }
        };
        var decodeAudioData = function(arraybuffer, self2) {
          var error = function() {
            self2._emit("loaderror", null, "Decoding audio data failed.");
          };
          var success = function(buffer) {
            if (buffer && self2._sounds.length > 0) {
              cache[self2._src] = buffer;
              loadSound(self2, buffer);
            } else {
              error();
            }
          };
          if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
            Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
          } else {
            Howler2.ctx.decodeAudioData(arraybuffer, success, error);
          }
        };
        var loadSound = function(self2, buffer) {
          if (buffer && !self2._duration) {
            self2._duration = buffer.duration;
          }
          if (Object.keys(self2._sprite).length === 0) {
            self2._sprite = { __default: [0, self2._duration * 1e3] };
          }
          if (self2._state !== "loaded") {
            self2._state = "loaded";
            self2._emit("load");
            self2._loadQueue();
          }
        };
        var setupAudioContext = function() {
          if (!Howler2.usingWebAudio) {
            return;
          }
          try {
            if (typeof AudioContext !== "undefined") {
              Howler2.ctx = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
              Howler2.ctx = new webkitAudioContext();
            } else {
              Howler2.usingWebAudio = false;
            }
          } catch (e) {
            Howler2.usingWebAudio = false;
          }
          if (!Howler2.ctx) {
            Howler2.usingWebAudio = false;
          }
          var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
          var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
          var version = appVersion ? parseInt(appVersion[1], 10) : null;
          if (iOS && version && version < 9) {
            var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
            if (Howler2._navigator && !safari) {
              Howler2.usingWebAudio = false;
            }
          }
          if (Howler2.usingWebAudio) {
            Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
            Howler2.masterGain.connect(Howler2.ctx.destination);
          }
          Howler2._setup();
        };
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return {
              Howler: Howler2,
              Howl: Howl2
            };
          });
        }
        if (typeof exports !== "undefined") {
          exports.Howler = Howler2;
          exports.Howl = Howl2;
        }
        if (typeof global !== "undefined") {
          global.HowlerGlobal = HowlerGlobal2;
          global.Howler = Howler2;
          global.Howl = Howl2;
          global.Sound = Sound2;
        } else if (typeof window !== "undefined") {
          window.HowlerGlobal = HowlerGlobal2;
          window.Howler = Howler2;
          window.Howl = Howl2;
          window.Sound = Sound2;
        }
      })();
      (function() {
        "use strict";
        HowlerGlobal.prototype._pos = [0, 0, 0];
        HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
        HowlerGlobal.prototype.stereo = function(pan) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          for (var i = self2._howls.length - 1; i >= 0; i--) {
            self2._howls[i].stereo(pan);
          }
          return self2;
        };
        HowlerGlobal.prototype.pos = function(x, y, z) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          y = typeof y !== "number" ? self2._pos[1] : y;
          z = typeof z !== "number" ? self2._pos[2] : z;
          if (typeof x === "number") {
            self2._pos = [x, y, z];
            if (typeof self2.ctx.listener.positionX !== "undefined") {
              self2.ctx.listener.positionX.setTargetAtTime(self2._pos[0], Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.positionY.setTargetAtTime(self2._pos[1], Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.positionZ.setTargetAtTime(self2._pos[2], Howler.ctx.currentTime, 0.1);
            } else {
              self2.ctx.listener.setPosition(self2._pos[0], self2._pos[1], self2._pos[2]);
            }
          } else {
            return self2._pos;
          }
          return self2;
        };
        HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          var or = self2._orientation;
          y = typeof y !== "number" ? or[1] : y;
          z = typeof z !== "number" ? or[2] : z;
          xUp = typeof xUp !== "number" ? or[3] : xUp;
          yUp = typeof yUp !== "number" ? or[4] : yUp;
          zUp = typeof zUp !== "number" ? or[5] : zUp;
          if (typeof x === "number") {
            self2._orientation = [x, y, z, xUp, yUp, zUp];
            if (typeof self2.ctx.listener.forwardX !== "undefined") {
              self2.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
            } else {
              self2.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
            }
          } else {
            return or;
          }
          return self2;
        };
        Howl.prototype.init = function(_super) {
          return function(o) {
            var self2 = this;
            self2._orientation = o.orientation || [1, 0, 0];
            self2._stereo = o.stereo || null;
            self2._pos = o.pos || null;
            self2._pannerAttr = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
            };
            self2._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
            self2._onpos = o.onpos ? [{ fn: o.onpos }] : [];
            self2._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
            return _super.call(this, o);
          };
        }(Howl.prototype.init);
        Howl.prototype.stereo = function(pan, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "stereo",
              action: function() {
                self2.stereo(pan, id);
              }
            });
            return self2;
          }
          var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
          if (typeof id === "undefined") {
            if (typeof pan === "number") {
              self2._stereo = pan;
              self2._pos = [pan, 0, 0];
            } else {
              return self2._stereo;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              if (typeof pan === "number") {
                sound._stereo = pan;
                sound._pos = [pan, 0, 0];
                if (sound._node) {
                  sound._pannerAttr.panningModel = "equalpower";
                  if (!sound._panner || !sound._panner.pan) {
                    setupPanner(sound, pannerType);
                  }
                  if (pannerType === "spatial") {
                    if (typeof sound._panner.positionX !== "undefined") {
                      sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                      sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                      sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                    } else {
                      sound._panner.setPosition(pan, 0, 0);
                    }
                  } else {
                    sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                  }
                }
                self2._emit("stereo", sound._id);
              } else {
                return sound._stereo;
              }
            }
          }
          return self2;
        };
        Howl.prototype.pos = function(x, y, z, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "pos",
              action: function() {
                self2.pos(x, y, z, id);
              }
            });
            return self2;
          }
          y = typeof y !== "number" ? 0 : y;
          z = typeof z !== "number" ? -0.5 : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self2._pos = [x, y, z];
            } else {
              return self2._pos;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              if (typeof x === "number") {
                sound._pos = [x, y, z];
                if (sound._node) {
                  if (!sound._panner || sound._panner.pan) {
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(x, y, z);
                  }
                }
                self2._emit("pos", sound._id);
              } else {
                return sound._pos;
              }
            }
          }
          return self2;
        };
        Howl.prototype.orientation = function(x, y, z, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "orientation",
              action: function() {
                self2.orientation(x, y, z, id);
              }
            });
            return self2;
          }
          y = typeof y !== "number" ? self2._orientation[1] : y;
          z = typeof z !== "number" ? self2._orientation[2] : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self2._orientation = [x, y, z];
            } else {
              return self2._orientation;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              if (typeof x === "number") {
                sound._orientation = [x, y, z];
                if (sound._node) {
                  if (!sound._panner) {
                    if (!sound._pos) {
                      sound._pos = self2._pos || [0, 0, -0.5];
                    }
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.orientationX !== "undefined") {
                    sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setOrientation(x, y, z);
                  }
                }
                self2._emit("orientation", sound._id);
              } else {
                return sound._orientation;
              }
            }
          }
          return self2;
        };
        Howl.prototype.pannerAttr = function() {
          var self2 = this;
          var args = arguments;
          var o, id, sound;
          if (!self2._webAudio) {
            return self2;
          }
          if (args.length === 0) {
            return self2._pannerAttr;
          } else if (args.length === 1) {
            if (typeof args[0] === "object") {
              o = args[0];
              if (typeof id === "undefined") {
                if (!o.pannerAttr) {
                  o.pannerAttr = {
                    coneInnerAngle: o.coneInnerAngle,
                    coneOuterAngle: o.coneOuterAngle,
                    coneOuterGain: o.coneOuterGain,
                    distanceModel: o.distanceModel,
                    maxDistance: o.maxDistance,
                    refDistance: o.refDistance,
                    rolloffFactor: o.rolloffFactor,
                    panningModel: o.panningModel
                  };
                }
                self2._pannerAttr = {
                  coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self2._coneInnerAngle,
                  coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self2._coneOuterAngle,
                  coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self2._coneOuterGain,
                  distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self2._distanceModel,
                  maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self2._maxDistance,
                  refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self2._refDistance,
                  rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self2._rolloffFactor,
                  panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self2._panningModel
                };
              }
            } else {
              sound = self2._soundById(parseInt(args[0], 10));
              return sound ? sound._pannerAttr : self2._pannerAttr;
            }
          } else if (args.length === 2) {
            o = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound = self2._soundById(ids[i]);
            if (sound) {
              var pa = sound._pannerAttr;
              pa = {
                coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
                coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
                coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
                distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
                maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
                refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
                rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
                panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
              };
              var panner = sound._panner;
              if (panner) {
                panner.coneInnerAngle = pa.coneInnerAngle;
                panner.coneOuterAngle = pa.coneOuterAngle;
                panner.coneOuterGain = pa.coneOuterGain;
                panner.distanceModel = pa.distanceModel;
                panner.maxDistance = pa.maxDistance;
                panner.refDistance = pa.refDistance;
                panner.rolloffFactor = pa.rolloffFactor;
                panner.panningModel = pa.panningModel;
              } else {
                if (!sound._pos) {
                  sound._pos = self2._pos || [0, 0, -0.5];
                }
                setupPanner(sound, "spatial");
              }
            }
          }
          return self2;
        };
        Sound.prototype.init = function(_super) {
          return function() {
            var self2 = this;
            var parent = self2._parent;
            self2._orientation = parent._orientation;
            self2._stereo = parent._stereo;
            self2._pos = parent._pos;
            self2._pannerAttr = parent._pannerAttr;
            _super.call(this);
            if (self2._stereo) {
              parent.stereo(self2._stereo);
            } else if (self2._pos) {
              parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
            }
          };
        }(Sound.prototype.init);
        Sound.prototype.reset = function(_super) {
          return function() {
            var self2 = this;
            var parent = self2._parent;
            self2._orientation = parent._orientation;
            self2._stereo = parent._stereo;
            self2._pos = parent._pos;
            self2._pannerAttr = parent._pannerAttr;
            if (self2._stereo) {
              parent.stereo(self2._stereo);
            } else if (self2._pos) {
              parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
            } else if (self2._panner) {
              self2._panner.disconnect(0);
              self2._panner = void 0;
              parent._refreshBuffer(self2);
            }
            return _super.call(this);
          };
        }(Sound.prototype.reset);
        var setupPanner = function(sound, type) {
          type = type || "spatial";
          if (type === "spatial") {
            sound._panner = Howler.ctx.createPanner();
            sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
            sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
            sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
            sound._panner.distanceModel = sound._pannerAttr.distanceModel;
            sound._panner.maxDistance = sound._pannerAttr.maxDistance;
            sound._panner.refDistance = sound._pannerAttr.refDistance;
            sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
            sound._panner.panningModel = sound._pannerAttr.panningModel;
            if (typeof sound._panner.positionX !== "undefined") {
              sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
            }
            if (typeof sound._panner.orientationX !== "undefined") {
              sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
            }
          } else {
            sound._panner = Howler.ctx.createStereoPanner();
            sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
          }
          sound._panner.connect(sound._node);
          if (!sound._paused) {
            sound._parent.pause(sound._id, true).play(sound._id, true);
          }
        };
      })();
    }
  });

  // node_modules/earcut/src/earcut.js
  var require_earcut = __commonJS({
    "node_modules/earcut/src/earcut.js"(exports, module) {
      "use strict";
      module.exports = earcut2;
      module.exports.default = earcut2;
      function earcut2(data, holeIndices, dim) {
        dim = dim || 2;
        var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
        if (!outerNode || outerNode.next === outerNode.prev)
          return triangles;
        var minX, minY, maxX, maxY, x, y, invSize;
        if (hasHoles)
          outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
        if (data.length > 80 * dim) {
          minX = maxX = data[0];
          minY = maxY = data[1];
          for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX)
              minX = x;
            if (y < minY)
              minY = y;
            if (x > maxX)
              maxX = x;
            if (y > maxY)
              maxY = y;
          }
          invSize = Math.max(maxX - minX, maxY - minY);
          invSize = invSize !== 0 ? 32767 / invSize : 0;
        }
        earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
        return triangles;
      }
      function linkedList(data, start, end, dim, clockwise) {
        var i, last;
        if (clockwise === signedArea(data, start, end, dim) > 0) {
          for (i = start; i < end; i += dim)
            last = insertNode(i, data[i], data[i + 1], last);
        } else {
          for (i = end - dim; i >= start; i -= dim)
            last = insertNode(i, data[i], data[i + 1], last);
        }
        if (last && equals6(last, last.next)) {
          removeNode(last);
          last = last.next;
        }
        return last;
      }
      function filterPoints(start, end) {
        if (!start)
          return start;
        if (!end)
          end = start;
        var p = start, again;
        do {
          again = false;
          if (!p.steiner && (equals6(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next)
              break;
            again = true;
          } else {
            p = p.next;
          }
        } while (again || p !== end);
        return end;
      }
      function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear)
          return;
        if (!pass && invSize)
          indexCurve(ear, minX, minY, invSize);
        var stop = ear, prev, next;
        while (ear.prev !== ear.next) {
          prev = ear.prev;
          next = ear.next;
          if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            triangles.push(prev.i / dim | 0);
            triangles.push(ear.i / dim | 0);
            triangles.push(next.i / dim | 0);
            removeNode(ear);
            ear = next.next;
            stop = next.next;
            continue;
          }
          ear = next;
          if (ear === stop) {
            if (!pass) {
              earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
            } else if (pass === 1) {
              ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
              earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
            } else if (pass === 2) {
              splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }
            break;
          }
        }
      }
      function isEar(ear) {
        var a = ear.prev, b = ear, c = ear.next;
        if (area(a, b, c) >= 0)
          return false;
        var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var p = c.next;
        while (p !== a) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.next;
        }
        return true;
      }
      function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev, b = ear, c = ear.next;
        if (area(a, b, c) >= 0)
          return false;
        var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
        var p = ear.prevZ, n = ear.nextZ;
        while (p && p.z >= minZ && n && n.z <= maxZ) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.prevZ;
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        while (p && p.z >= minZ) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.prevZ;
        }
        while (n && n.z <= maxZ) {
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        return true;
      }
      function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
          var a = p.prev, b = p.next.next;
          if (!equals6(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
            triangles.push(a.i / dim | 0);
            triangles.push(p.i / dim | 0);
            triangles.push(b.i / dim | 0);
            removeNode(p);
            removeNode(p.next);
            p = start = b;
          }
          p = p.next;
        } while (p !== start);
        return filterPoints(p);
      }
      function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        var a = start;
        do {
          var b = a.next.next;
          while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
              var c = splitPolygon(a, b);
              a = filterPoints(a, a.next);
              c = filterPoints(c, c.next);
              earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
              earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
              return;
            }
            b = b.next;
          }
          a = a.next;
        } while (a !== start);
      }
      function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [], i, len4, start, end, list;
        for (i = 0, len4 = holeIndices.length; i < len4; i++) {
          start = holeIndices[i] * dim;
          end = i < len4 - 1 ? holeIndices[i + 1] * dim : data.length;
          list = linkedList(data, start, end, dim, false);
          if (list === list.next)
            list.steiner = true;
          queue.push(getLeftmost(list));
        }
        queue.sort(compareX);
        for (i = 0; i < queue.length; i++) {
          outerNode = eliminateHole(queue[i], outerNode);
        }
        return outerNode;
      }
      function compareX(a, b) {
        return a.x - b.x;
      }
      function eliminateHole(hole, outerNode) {
        var bridge = findHoleBridge(hole, outerNode);
        if (!bridge) {
          return outerNode;
        }
        var bridgeReverse = splitPolygon(bridge, hole);
        filterPoints(bridgeReverse, bridgeReverse.next);
        return filterPoints(bridge, bridge.next);
      }
      function findHoleBridge(hole, outerNode) {
        var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
        do {
          if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
              qx = x;
              m = p.x < p.next.x ? p : p.next;
              if (x === hx)
                return m;
            }
          }
          p = p.next;
        } while (p !== outerNode);
        if (!m)
          return null;
        var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan;
        p = m;
        do {
          if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
            tan = Math.abs(hy - p.y) / (hx - p.x);
            if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
              m = p;
              tanMin = tan;
            }
          }
          p = p.next;
        } while (p !== stop);
        return m;
      }
      function sectorContainsSector(m, p) {
        return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
      }
      function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
          if (p.z === 0)
            p.z = zOrder(p.x, p.y, minX, minY, invSize);
          p.prevZ = p.prev;
          p.nextZ = p.next;
          p = p.next;
        } while (p !== start);
        p.prevZ.nextZ = null;
        p.prevZ = null;
        sortLinked(p);
      }
      function sortLinked(list) {
        var i, p, q2, e, tail, numMerges, pSize, qSize, inSize = 1;
        do {
          p = list;
          list = null;
          tail = null;
          numMerges = 0;
          while (p) {
            numMerges++;
            q2 = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
              pSize++;
              q2 = q2.nextZ;
              if (!q2)
                break;
            }
            qSize = inSize;
            while (pSize > 0 || qSize > 0 && q2) {
              if (pSize !== 0 && (qSize === 0 || !q2 || p.z <= q2.z)) {
                e = p;
                p = p.nextZ;
                pSize--;
              } else {
                e = q2;
                q2 = q2.nextZ;
                qSize--;
              }
              if (tail)
                tail.nextZ = e;
              else
                list = e;
              e.prevZ = tail;
              tail = e;
            }
            p = q2;
          }
          tail.nextZ = null;
          inSize *= 2;
        } while (numMerges > 1);
        return list;
      }
      function zOrder(x, y, minX, minY, invSize) {
        x = (x - minX) * invSize | 0;
        y = (y - minY) * invSize | 0;
        x = (x | x << 8) & 16711935;
        x = (x | x << 4) & 252645135;
        x = (x | x << 2) & 858993459;
        x = (x | x << 1) & 1431655765;
        y = (y | y << 8) & 16711935;
        y = (y | y << 4) & 252645135;
        y = (y | y << 2) & 858993459;
        y = (y | y << 1) & 1431655765;
        return x | y << 1;
      }
      function getLeftmost(start) {
        var p = start, leftmost = start;
        do {
          if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
            leftmost = p;
          p = p.next;
        } while (p !== start);
        return leftmost;
      }
      function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
      }
      function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
        (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
        (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
        equals6(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
      }
      function area(p, q2, r) {
        return (q2.y - p.y) * (r.x - q2.x) - (q2.x - p.x) * (r.y - q2.y);
      }
      function equals6(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
      }
      function intersects(p1, q1, p2, q2) {
        var o1 = sign(area(p1, q1, p2));
        var o2 = sign(area(p1, q1, q2));
        var o3 = sign(area(p2, q2, p1));
        var o4 = sign(area(p2, q2, q1));
        if (o1 !== o2 && o3 !== o4)
          return true;
        if (o1 === 0 && onSegment(p1, p2, q1))
          return true;
        if (o2 === 0 && onSegment(p1, q2, q1))
          return true;
        if (o3 === 0 && onSegment(p2, p1, q2))
          return true;
        if (o4 === 0 && onSegment(p2, q1, q2))
          return true;
        return false;
      }
      function onSegment(p, q2, r) {
        return q2.x <= Math.max(p.x, r.x) && q2.x >= Math.min(p.x, r.x) && q2.y <= Math.max(p.y, r.y) && q2.y >= Math.min(p.y, r.y);
      }
      function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
      }
      function intersectsPolygon(a, b) {
        var p = a;
        do {
          if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
            return true;
          p = p.next;
        } while (p !== a);
        return false;
      }
      function locallyInside(a, b) {
        return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
      }
      function middleInside(a, b) {
        var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
        do {
          if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
            inside = !inside;
          p = p.next;
        } while (p !== a);
        return inside;
      }
      function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
        a.next = b;
        b.prev = a;
        a2.next = an;
        an.prev = a2;
        b2.next = a2;
        a2.prev = b2;
        bp.next = b2;
        b2.prev = bp;
        return b2;
      }
      function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);
        if (!last) {
          p.prev = p;
          p.next = p;
        } else {
          p.next = last.next;
          p.prev = last;
          last.next.prev = p;
          last.next = p;
        }
        return p;
      }
      function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;
        if (p.prevZ)
          p.prevZ.nextZ = p.nextZ;
        if (p.nextZ)
          p.nextZ.prevZ = p.prevZ;
      }
      function Node(i, x, y) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.prev = null;
        this.next = null;
        this.z = 0;
        this.prevZ = null;
        this.nextZ = null;
        this.steiner = false;
      }
      earcut2.deviation = function(data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
          for (var i = 0, len4 = holeIndices.length; i < len4; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len4 - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
          }
        }
        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
          var a = triangles[i] * dim;
          var b = triangles[i + 1] * dim;
          var c = triangles[i + 2] * dim;
          trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1])
          );
        }
        return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
      };
      function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
          sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
          j = i;
        }
        return sum;
      }
      earcut2.flatten = function(data) {
        var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++)
              result.vertices.push(data[i][j][d]);
          }
          if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
          }
        }
        return result;
      };
    }
  });

  // node_modules/@wonderlandengine/components/dist/index.js
  var dist_exports = {};
  __export(dist_exports, {
    ARCamera8thwall: () => ARCamera8thwall,
    Anchor: () => Anchor,
    Cursor: () => Cursor,
    CursorTarget: () => CursorTarget,
    DebugObject: () => DebugObject,
    DeviceOrientationLook: () => DeviceOrientationLook,
    FingerCursor: () => FingerCursor,
    FixedFoveation: () => FixedFoveation,
    HandTracking: () => HandTracking,
    HitTestLocation: () => HitTestLocation,
    HowlerAudioListener: () => HowlerAudioListener,
    HowlerAudioSource: () => HowlerAudioSource,
    ImageTexture: () => ImageTexture,
    InputProfile: () => InputProfile,
    MouseLookComponent: () => MouseLookComponent,
    OrbitalCamera: () => OrbitalCamera,
    PlaneDetection: () => PlaneDetection,
    PlayerHeight: () => PlayerHeight,
    TargetFramerate: () => TargetFramerate,
    TeleportComponent: () => TeleportComponent,
    Trail: () => Trail,
    TwoJointIkSolver: () => TwoJointIkSolver,
    VideoTexture: () => VideoTexture,
    VrModeActiveSwitch: () => VrModeActiveSwitch,
    Vrm: () => Vrm,
    WasdControlsComponent: () => WasdControlsComponent,
    isPointLocalOnXRPlanePolygon: () => isPointLocalOnXRPlanePolygon,
    isPointWorldOnXRPlanePolygon: () => isPointWorldOnXRPlanePolygon
  });

  // node_modules/@wonderlandengine/api/dist/index.js
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    for (var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc2(target, key) : target, i = decorators.length - 1, decorator; i >= 0; i--)
      (decorator = decorators[i]) && (result = (kind ? decorator(target, key, result) : decorator(result)) || result);
    return kind && result && __defProp2(target, key, result), result;
  };
  var Type = ((Type2) => (Type2[Type2.Native = 0] = "Native", Type2[Type2.Bool = 1] = "Bool", Type2[Type2.Int = 2] = "Int", Type2[Type2.Float = 3] = "Float", Type2[Type2.String = 4] = "String", Type2[Type2.Enum = 5] = "Enum", Type2[Type2.Object = 6] = "Object", Type2[Type2.Mesh = 7] = "Mesh", Type2[Type2.Texture = 8] = "Texture", Type2[Type2.Material = 9] = "Material", Type2[Type2.Animation = 10] = "Animation", Type2[Type2.Skin = 11] = "Skin", Type2[Type2.Color = 12] = "Color", Type2[Type2.Vector2 = 13] = "Vector2", Type2[Type2.Vector3 = 14] = "Vector3", Type2[Type2.Vector4 = 15] = "Vector4", Type2))(Type || {});
  var DefaultPropertyCloner = class {
    clone(type, value) {
      switch (type) {
        case 12:
        case 13:
        case 14:
        case 15:
          return value.slice();
        default:
          return value;
      }
    }
  };
  var defaultPropertyCloner = new DefaultPropertyCloner();
  var Property = { bool(defaultValue = false) {
    return { type: 1, default: defaultValue };
  }, int(defaultValue = 0) {
    return { type: 2, default: defaultValue };
  }, float(defaultValue = 0) {
    return { type: 3, default: defaultValue };
  }, string(defaultValue = "") {
    return { type: 4, default: defaultValue };
  }, enum(values, defaultValue) {
    return { type: 5, values, default: defaultValue };
  }, object(opts) {
    return { type: 6, default: null, required: opts?.required ?? false };
  }, mesh(opts) {
    return { type: 7, default: null, required: opts?.required ?? false };
  }, texture(opts) {
    return { type: 8, default: null, required: opts?.required ?? false };
  }, material(opts) {
    return { type: 9, default: null, required: opts?.required ?? false };
  }, animation(opts) {
    return { type: 10, default: null, required: opts?.required ?? false };
  }, skin(opts) {
    return { type: 11, default: null, required: opts?.required ?? false };
  }, color(r = 0, g = 0, b = 0, a = 1) {
    return { type: 12, default: [r, g, b, a] };
  }, vector2(x = 0, y = 0) {
    return { type: 13, default: [x, y] };
  }, vector3(x = 0, y = 0, z = 0) {
    return { type: 14, default: [x, y, z] };
  }, vector4(x = 0, y = 0, z = 0, w = 0) {
    return { type: 15, default: [x, y, z, w] };
  } };
  function propertyDecorator(data) {
    return function(target, propertyKey) {
      let ctor = target.constructor;
      ctor.Properties = ctor.hasOwnProperty("Properties") ? ctor.Properties : {}, ctor.Properties[propertyKey] = data;
    };
  }
  function enumerable() {
    return function(_, __, descriptor) {
      descriptor.enumerable = true;
    };
  }
  function nativeProperty() {
    return function(target, propertyKey, descriptor) {
      enumerable()(target, propertyKey, descriptor), propertyDecorator({ type: 0 })(target, propertyKey);
    };
  }
  var property = {};
  for (let name in Property)
    property[name] = (...args) => {
      let functor = Property[name];
      return propertyDecorator(functor(...args));
    };
  function isNumber(value) {
    return value == null ? false : typeof value == "number" || value.constructor === Number;
  }
  function isImageLike(value) {
    return value instanceof HTMLImageElement || value instanceof HTMLVideoElement || value instanceof HTMLCanvasElement;
  }
  var Emitter = class {
    _listeners = [];
    _notifying = false;
    _transactions = [];
    add(listener, opts = {}) {
      let { once = false, id = void 0 } = opts, data = { id, once, callback: listener };
      return this._notifying ? (this._transactions.push({ type: 1, data }), this) : (this._listeners.push(data), this);
    }
    push(...listeners) {
      for (let cb of listeners)
        this.add(cb);
      return this;
    }
    once(listener) {
      return this.add(listener, { once: true });
    }
    remove(listener) {
      if (this._notifying)
        return this._transactions.push({ type: 2, data: listener }), this;
      let listeners = this._listeners;
      for (let i = 0; i < listeners.length; ++i) {
        let target = listeners[i];
        (target.callback === listener || target.id === listener) && listeners.splice(i--, 1);
      }
      return this;
    }
    has(listener) {
      let listeners = this._listeners;
      for (let i = 0; i < listeners.length; ++i) {
        let target = listeners[i];
        if (target.callback === listener || target.id === listener)
          return true;
      }
      return false;
    }
    notify(...data) {
      let listeners = this._listeners;
      this._notifying = true;
      for (let i = 0; i < listeners.length; ++i) {
        let listener = listeners[i];
        listener.once && listeners.splice(i--, 1);
        try {
          listener.callback(...data);
        } catch (e) {
          console.error(e);
        }
      }
      this._notifying = false, this._flushTransactions();
    }
    notifyUnsafe(...data) {
      let listeners = this._listeners;
      for (let i = 0; i < listeners.length; ++i) {
        let listener = listeners[i];
        listener.once && listeners.splice(i--, 1), listener.callback(...data);
      }
      this._flushTransactions();
    }
    promise() {
      return new Promise((res, _) => {
        this.once((...args) => {
          args.length > 1 ? res(args) : res(args[0]);
        });
      });
    }
    get listenerCount() {
      return this._listeners.length;
    }
    get isEmpty() {
      return this.listenerCount === 0;
    }
    _flushTransactions() {
      let listeners = this._listeners;
      for (let transaction of this._transactions)
        transaction.type === 1 ? listeners.push(transaction.data) : this.remove(transaction.data);
      this._transactions.length = 0;
    }
  };
  var RetainEmitterUndefined = {};
  var RetainEmitter = class extends Emitter {
    _event = RetainEmitterUndefined;
    _reset;
    add(listener, opts) {
      let immediate = opts?.immediate ?? true;
      return this._event !== RetainEmitterUndefined && immediate && listener(...this._event), super.add(listener, opts), this;
    }
    once(listener, immediate) {
      return this.add(listener, { once: true, immediate });
    }
    notify(...data) {
      this._event = data, super.notify(...data);
    }
    notifyUnsafe(...data) {
      this._event = data, super.notifyUnsafe(...data);
    }
    reset() {
      return this._event = RetainEmitterUndefined, this;
    }
    get data() {
      return this.isDataRetained ? this._event : void 0;
    }
    get isDataRetained() {
      return this._event !== RetainEmitterUndefined;
    }
  };
  var Resource = class {
    _index = -1;
    _id = -1;
    _engine;
    constructor(engine, index) {
      this._engine = engine, this._index = index, this._id = index;
    }
    get engine() {
      return this._engine;
    }
    get index() {
      return this._index;
    }
    equals(other) {
      return other ? this._index === other._index : false;
    }
    get isDestroyed() {
      return this._index <= 0;
    }
  };
  function createDestroyedProxy2(type) {
    return new Proxy({}, { get(_, param) {
      if (param === "isDestroyed")
        return true;
      throw new Error(`Cannot read '${param}' of destroyed ${type}`);
    }, set(_, param) {
      throw new Error(`Cannot write '${param}' of destroyed ${type}`);
    } });
  }
  var LogTag = ((LogTag2) => (LogTag2[LogTag2.Engine = 0] = "Engine", LogTag2[LogTag2.Scene = 1] = "Scene", LogTag2[LogTag2.Component = 2] = "Component", LogTag2))(LogTag || {});
  var Collider = ((Collider2) => (Collider2[Collider2.Sphere = 0] = "Sphere", Collider2[Collider2.AxisAlignedBox = 1] = "AxisAlignedBox", Collider2[Collider2.Box = 2] = "Box", Collider2))(Collider || {});
  var Alignment = ((Alignment2) => (Alignment2[Alignment2.Left = 0] = "Left", Alignment2[Alignment2.Center = 1] = "Center", Alignment2[Alignment2.Right = 2] = "Right", Alignment2))(Alignment || {});
  var VerticalAlignment = ((VerticalAlignment2) => (VerticalAlignment2[VerticalAlignment2.Line = 0] = "Line", VerticalAlignment2[VerticalAlignment2.Middle = 1] = "Middle", VerticalAlignment2[VerticalAlignment2.Top = 2] = "Top", VerticalAlignment2[VerticalAlignment2.Bottom = 3] = "Bottom", VerticalAlignment2))(VerticalAlignment || {});
  var TextEffect = ((TextEffect2) => (TextEffect2[TextEffect2.None = 0] = "None", TextEffect2[TextEffect2.Outline = 1] = "Outline", TextEffect2))(TextEffect || {});
  var TextWrapMode = ((TextWrapMode2) => (TextWrapMode2[TextWrapMode2.None = 0] = "None", TextWrapMode2[TextWrapMode2.Soft = 1] = "Soft", TextWrapMode2[TextWrapMode2.Hard = 2] = "Hard", TextWrapMode2[TextWrapMode2.Clip = 3] = "Clip", TextWrapMode2))(TextWrapMode || {});
  var InputType = ((InputType2) => (InputType2[InputType2.Head = 0] = "Head", InputType2[InputType2.EyeLeft = 1] = "EyeLeft", InputType2[InputType2.EyeRight = 2] = "EyeRight", InputType2[InputType2.ControllerLeft = 3] = "ControllerLeft", InputType2[InputType2.ControllerRight = 4] = "ControllerRight", InputType2[InputType2.RayLeft = 5] = "RayLeft", InputType2[InputType2.RayRight = 6] = "RayRight", InputType2))(InputType || {});
  var ProjectionType = ((ProjectionType2) => (ProjectionType2[ProjectionType2.Perspective = 0] = "Perspective", ProjectionType2[ProjectionType2.Orthographic = 1] = "Orthographic", ProjectionType2))(ProjectionType || {});
  var LightType = ((LightType2) => (LightType2[LightType2.Point = 0] = "Point", LightType2[LightType2.Spot = 1] = "Spot", LightType2[LightType2.Sun = 2] = "Sun", LightType2))(LightType || {});
  var AnimationState = ((AnimationState2) => (AnimationState2[AnimationState2.Playing = 0] = "Playing", AnimationState2[AnimationState2.Paused = 1] = "Paused", AnimationState2[AnimationState2.Stopped = 2] = "Stopped", AnimationState2))(AnimationState || {});
  var RootMotionMode = ((RootMotionMode2) => (RootMotionMode2[RootMotionMode2.None = 0] = "None", RootMotionMode2[RootMotionMode2.ApplyToOwner = 1] = "ApplyToOwner", RootMotionMode2[RootMotionMode2.Script = 2] = "Script", RootMotionMode2))(RootMotionMode || {});
  var ForceMode = ((ForceMode2) => (ForceMode2[ForceMode2.Force = 0] = "Force", ForceMode2[ForceMode2.Impulse = 1] = "Impulse", ForceMode2[ForceMode2.VelocityChange = 2] = "VelocityChange", ForceMode2[ForceMode2.Acceleration = 3] = "Acceleration", ForceMode2))(ForceMode || {});
  var CollisionEventType = ((CollisionEventType2) => (CollisionEventType2[CollisionEventType2.Touch = 0] = "Touch", CollisionEventType2[CollisionEventType2.TouchLost = 1] = "TouchLost", CollisionEventType2[CollisionEventType2.TriggerTouch = 2] = "TriggerTouch", CollisionEventType2[CollisionEventType2.TriggerTouchLost = 3] = "TriggerTouchLost", CollisionEventType2))(CollisionEventType || {});
  var Shape = ((Shape2) => (Shape2[Shape2.None = 0] = "None", Shape2[Shape2.Sphere = 1] = "Sphere", Shape2[Shape2.Capsule = 2] = "Capsule", Shape2[Shape2.Box = 3] = "Box", Shape2[Shape2.Plane = 4] = "Plane", Shape2[Shape2.ConvexMesh = 5] = "ConvexMesh", Shape2[Shape2.TriangleMesh = 6] = "TriangleMesh", Shape2))(Shape || {});
  var MeshAttribute = ((MeshAttribute2) => (MeshAttribute2[MeshAttribute2.Position = 0] = "Position", MeshAttribute2[MeshAttribute2.Tangent = 1] = "Tangent", MeshAttribute2[MeshAttribute2.Normal = 2] = "Normal", MeshAttribute2[MeshAttribute2.TextureCoordinate = 3] = "TextureCoordinate", MeshAttribute2[MeshAttribute2.Color = 4] = "Color", MeshAttribute2[MeshAttribute2.JointId = 5] = "JointId", MeshAttribute2[MeshAttribute2.JointWeight = 6] = "JointWeight", MeshAttribute2))(MeshAttribute || {});
  var DestroyedObjectInstance = createDestroyedProxy2("object");
  var DestroyedComponentInstance = createDestroyedProxy2("component");
  var DestroyedPrefabInstance = createDestroyedProxy2("prefab/scene");
  function isMeshShape(shape) {
    return shape === 5 || shape === 6;
  }
  function isBaseComponentClass(value) {
    return !!value && value.hasOwnProperty("_isBaseComponent") && value._isBaseComponent;
  }
  var SQRT_3 = Math.sqrt(3);
  var _a;
  var Component3 = (_a = class {
    static _pack(scene, id) {
      return scene << 22 | id;
    }
    static _inheritProperties() {
      inheritProperties(this);
    }
    _manager;
    _id;
    _localId;
    _object;
    _scene;
    constructor(scene, manager = -1, id = -1) {
      this._scene = scene, this._manager = manager, this._localId = id, this._id = _a._pack(scene._index, id), this._object = null;
    }
    get scene() {
      return this._scene;
    }
    get engine() {
      return this._scene.engine;
    }
    get type() {
      return this.constructor.TypeName;
    }
    get object() {
      if (!this._object) {
        let objectId = this.engine.wasm._wl_component_get_object(this._manager, this._id);
        this._object = this._scene.wrap(objectId);
      }
      return this._object;
    }
    set active(active) {
      this.engine.wasm._wl_component_setActive(this._manager, this._id, active);
    }
    get active() {
      return this.markedActive && this._scene.isActive;
    }
    get markedActive() {
      return this.engine.wasm._wl_component_isActive(this._manager, this._id) != 0;
    }
    copy(src) {
      let properties = this.constructor.Properties;
      if (!properties)
        return this;
      for (let name in properties) {
        let property2 = properties[name], value = src[name];
        if (value === void 0)
          continue;
        let cloner = property2.cloner ?? defaultPropertyCloner;
        this[name] = cloner.clone(property2.type, value);
      }
      return this;
    }
    destroy() {
      let manager = this._manager;
      manager < 0 || this._id < 0 || this.engine.wasm._wl_component_remove(manager, this._id);
    }
    equals(otherComponent) {
      return otherComponent ? this._manager === otherComponent._manager && this._id === otherComponent._id : false;
    }
    resetProperties() {
      let properties = this.constructor.Properties;
      if (!properties)
        return this;
      for (let name in properties) {
        let property2 = properties[name], cloner = property2.cloner ?? defaultPropertyCloner;
        this[name] = cloner.clone(property2.type, property2.default);
      }
      return this;
    }
    reset() {
      return this.resetProperties();
    }
    validateProperties() {
      let ctor = this.constructor;
      if (ctor.Properties) {
        for (let name in ctor.Properties)
          if (ctor.Properties[name].required && !this[name])
            throw new Error(`Property '${name}' is required but was not initialized`);
      }
    }
    toString() {
      return this.isDestroyed ? "Component(destroyed)" : `Component('${this.type}', ${this._localId})`;
    }
    get isDestroyed() {
      return this._id < 0;
    }
    _copy(src, offsetsPtr) {
      let wasm = this.engine.wasm, offsets = wasm.HEAPU32, offsetsStart = offsetsPtr >>> 2, destScene = this._scene, ctor = this.constructor;
      for (let name in ctor.Properties) {
        let value = src[name];
        if (value === null) {
          this[name] = null;
          continue;
        }
        let prop = ctor.Properties[name], offset2 = offsets[offsetsStart + prop.type], retargeted;
        switch (prop.type) {
          case 6: {
            let index = wasm._wl_object_index(value._id), id = wasm._wl_object_id(destScene._index, index + offset2);
            retargeted = destScene.wrap(id);
            break;
          }
          case 10:
            retargeted = destScene.animations.wrap(offset2 + value._index);
            break;
          case 11:
            retargeted = destScene.skins.wrap(offset2 + value._index);
            break;
          default:
            retargeted = (prop.cloner ?? defaultPropertyCloner).clone(prop.type, value);
            break;
        }
        this[name] = retargeted;
      }
      return this;
    }
    _triggerInit() {
      if (this.init)
        try {
          this.init();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} init() on object ${this.object.name}`), this.engine.log.error(2, e);
        }
      let oldActivate = this.onActivate;
      this.onActivate = function() {
        this.onActivate = oldActivate;
        let failed = false;
        try {
          this.validateProperties();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} validateProperties() on object ${this.object.name}`), this.engine.log.error(2, e), failed = true;
        }
        try {
          this.start?.();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} start() on object ${this.object.name}`), this.engine.log.error(2, e), failed = true;
        }
        if (failed) {
          this.active = false;
          return;
        }
        if (this.onActivate)
          try {
            this.onActivate();
          } catch (e) {
            this.engine.log.error(2, `Exception during ${this.type} onActivate() on object ${this.object.name}`), this.engine.log.error(2, e);
          }
      };
    }
    _triggerUpdate(dt) {
      if (this.update)
        try {
          this.update(dt);
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} update() on object ${this.object.name}`), this.engine.log.error(2, e), this.engine.wasm._deactivate_component_on_error && (this.active = false);
        }
    }
    _triggerOnActivate() {
      if (this.onActivate)
        try {
          this.onActivate();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} onActivate() on object ${this.object.name}`), this.engine.log.error(2, e);
        }
    }
    _triggerOnDeactivate() {
      if (this.onDeactivate)
        try {
          this.onDeactivate();
        } catch (e) {
          this.engine.log.error(2, `Exception during ${this.type} onDeactivate() on object ${this.object.name}`), this.engine.log.error(2, e);
        }
    }
    _triggerOnDestroy() {
      try {
        this.onDestroy && this.onDestroy();
      } catch (e) {
        this.engine.log.error(2, `Exception during ${this.type} onDestroy() on object ${this.object.name}`), this.engine.log.error(2, e);
      }
      this._scene._components.destroy(this);
    }
  }, __publicField(_a, "_isBaseComponent", true), __publicField(_a, "_propertyOrder", []), __publicField(_a, "TypeName"), __publicField(_a, "Properties"), __publicField(_a, "InheritProperties"), __publicField(_a, "onRegister"), _a);
  var _a2;
  var BrokenComponent = (_a2 = class extends Component3 {
  }, __publicField(_a2, "TypeName", "__broken-component__"), _a2);
  function inheritProperties(target) {
    if (!target.TypeName)
      return;
    let chain = [], curr = target;
    for (; curr && !isBaseComponentClass(curr); ) {
      let comp = curr;
      if (!(comp.hasOwnProperty("InheritProperties") ? comp.InheritProperties : true))
        break;
      comp.hasOwnProperty("Properties") && chain.push(comp), curr = Object.getPrototypeOf(curr);
    }
    if (!chain.length || chain.length === 1 && chain[0] === target)
      return;
    let merged = {};
    for (let i = chain.length - 1; i >= 0; --i)
      Object.assign(merged, chain[i].Properties);
    target.Properties = merged;
  }
  var _a3;
  var CollisionComponent = (_a3 = class extends Component3 {
    getExtents(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
    }
    get collider() {
      return this.engine.wasm._wl_collision_component_get_collider(this._id);
    }
    set collider(collider) {
      this.engine.wasm._wl_collision_component_set_collider(this._id, collider);
    }
    get extents() {
      let wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3);
    }
    set extents(extents) {
      let wasm = this.engine.wasm, ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
      wasm.HEAPF32[ptr] = extents[0], wasm.HEAPF32[ptr + 1] = extents[1], wasm.HEAPF32[ptr + 2] = extents[2];
    }
    get radius() {
      let wasm = this.engine.wasm;
      if (this.collider === 0)
        return wasm.HEAPF32[wasm._wl_collision_component_get_extents(this._id) >> 2];
      let extents = new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3), x2 = extents[0] * extents[0], y2 = extents[1] * extents[1], z2 = extents[2] * extents[2];
      return Math.sqrt(x2 + y2 + z2) / 2;
    }
    set radius(radius) {
      let length5 = this.collider === 0 ? radius : 2 * radius / SQRT_3;
      this.extents.set([length5, length5, length5]);
    }
    get group() {
      return this.engine.wasm._wl_collision_component_get_group(this._id);
    }
    set group(group) {
      this.engine.wasm._wl_collision_component_set_group(this._id, group);
    }
    queryOverlaps() {
      let count = this.engine.wasm._wl_collision_component_query_overlaps(this._id, this.engine.wasm._tempMem, this.engine.wasm._tempMemSize >> 1), overlaps = new Array(count);
      for (let i = 0; i < count; ++i) {
        let id = this.engine.wasm._tempMemUint16[i];
        overlaps[i] = this._scene._components.wrapCollision(id);
      }
      return overlaps;
    }
  }, __publicField(_a3, "TypeName", "collision"), _a3);
  __decorateClass([nativeProperty()], CollisionComponent.prototype, "collider", 1), __decorateClass([nativeProperty()], CollisionComponent.prototype, "extents", 1), __decorateClass([nativeProperty()], CollisionComponent.prototype, "group", 1);
  var _a4;
  var TextComponent = (_a4 = class extends Component3 {
    get alignment() {
      return this.engine.wasm._wl_text_component_get_horizontal_alignment(this._id);
    }
    set alignment(alignment) {
      this.engine.wasm._wl_text_component_set_horizontal_alignment(this._id, alignment);
    }
    get verticalAlignment() {
      return this.engine.wasm._wl_text_component_get_vertical_alignment(this._id);
    }
    set verticalAlignment(verticalAlignment) {
      this.engine.wasm._wl_text_component_set_vertical_alignment(this._id, verticalAlignment);
    }
    get justification() {
      return this.verticalAlignment;
    }
    set justification(justification) {
      this.verticalAlignment = justification;
    }
    get characterSpacing() {
      return this.engine.wasm._wl_text_component_get_character_spacing(this._id);
    }
    set characterSpacing(spacing) {
      this.engine.wasm._wl_text_component_set_character_spacing(this._id, spacing);
    }
    get lineSpacing() {
      return this.engine.wasm._wl_text_component_get_line_spacing(this._id);
    }
    set lineSpacing(spacing) {
      this.engine.wasm._wl_text_component_set_line_spacing(this._id, spacing);
    }
    get effect() {
      return this.engine.wasm._wl_text_component_get_effect(this._id);
    }
    set effect(effect) {
      this.engine.wasm._wl_text_component_set_effect(this._id, effect);
    }
    get wrapMode() {
      return this.engine.wasm._wl_text_component_get_wrapMode(this._id);
    }
    set wrapMode(wrapMode) {
      this.engine.wasm._wl_text_component_set_wrapMode(this._id, wrapMode);
    }
    get wrapWidth() {
      return this.engine.wasm._wl_text_component_get_wrapWidth(this._id);
    }
    set wrapWidth(width) {
      this.engine.wasm._wl_text_component_set_wrapWidth(this._id, width);
    }
    get text() {
      let wasm = this.engine.wasm, ptr = wasm._wl_text_component_get_text(this._id);
      return wasm.UTF8ToString(ptr);
    }
    set text(text) {
      let wasm = this.engine.wasm;
      wasm._wl_text_component_set_text(this._id, wasm.tempUTF8(text.toString()));
    }
    set material(material) {
      let matIndex = material ? material._id : 0;
      this.engine.wasm._wl_text_component_set_material(this._id, matIndex);
    }
    get material() {
      let index = this.engine.wasm._wl_text_component_get_material(this._id);
      return this.engine.materials.wrap(index);
    }
    getBoundingBoxForText(text, out = new Float32Array(4)) {
      let wasm = this.engine.wasm, textPtr = wasm.tempUTF8(text, 4 * 4);
      return this.engine.wasm._wl_text_component_get_boundingBox(this._id, textPtr, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
    }
    getBoundingBox(out = new Float32Array(4)) {
      let wasm = this.engine.wasm;
      return this.engine.wasm._wl_text_component_get_boundingBox(this._id, 0, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
    }
  }, __publicField(_a4, "TypeName", "text"), _a4);
  __decorateClass([nativeProperty()], TextComponent.prototype, "alignment", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "verticalAlignment", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "justification", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "characterSpacing", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "lineSpacing", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "effect", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "wrapMode", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "wrapWidth", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "text", 1), __decorateClass([nativeProperty()], TextComponent.prototype, "material", 1);
  var _a5;
  var ViewComponent = (_a5 = class extends Component3 {
    get projectionType() {
      return this.engine.wasm._wl_view_component_get_projectionType(this._id);
    }
    set projectionType(type) {
      this.engine.wasm._wl_view_component_set_projectionType(this._id, type);
    }
    getProjectionMatrix(out = new Float32Array(16)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_view_component_get_projection_matrix(this._id) / 4;
      for (let i = 0; i < 16; ++i)
        out[i] = wasm.HEAPF32[ptr + i];
      return out;
    }
    get projectionMatrix() {
      let wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_view_component_get_projection_matrix(this._id), 16);
    }
    get near() {
      return this.engine.wasm._wl_view_component_get_near(this._id);
    }
    set near(near) {
      this.engine.wasm._wl_view_component_set_near(this._id, near);
    }
    get far() {
      return this.engine.wasm._wl_view_component_get_far(this._id);
    }
    set far(far) {
      this.engine.wasm._wl_view_component_set_far(this._id, far);
    }
    get fov() {
      return this.engine.wasm._wl_view_component_get_fov(this._id);
    }
    set fov(fov) {
      this.engine.wasm._wl_view_component_set_fov(this._id, fov);
    }
    get extent() {
      return this.engine.wasm._wl_view_component_get_extent(this._id);
    }
    set extent(extent) {
      this.engine.wasm._wl_view_component_set_extent(this._id, extent);
    }
  }, __publicField(_a5, "TypeName", "view"), _a5);
  __decorateClass([nativeProperty()], ViewComponent.prototype, "projectionType", 1), __decorateClass([enumerable()], ViewComponent.prototype, "projectionMatrix", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "near", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "far", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "fov", 1), __decorateClass([nativeProperty()], ViewComponent.prototype, "extent", 1);
  var _a6;
  var InputComponent = (_a6 = class extends Component3 {
    get inputType() {
      return this.engine.wasm._wl_input_component_get_type(this._id);
    }
    set inputType(type) {
      this.engine.wasm._wl_input_component_set_type(this._id, type);
    }
    get xrInputSource() {
      let xr = this.engine.xr;
      if (!xr)
        return null;
      for (let inputSource of xr.session.inputSources)
        if (inputSource.handedness == this.handedness)
          return inputSource;
      return null;
    }
    get handedness() {
      let inputType = this.inputType;
      return inputType == 4 || inputType == 6 || inputType == 2 ? "right" : inputType == 3 || inputType == 5 || inputType == 1 ? "left" : null;
    }
  }, __publicField(_a6, "TypeName", "input"), _a6);
  __decorateClass([nativeProperty()], InputComponent.prototype, "inputType", 1), __decorateClass([enumerable()], InputComponent.prototype, "xrInputSource", 1), __decorateClass([enumerable()], InputComponent.prototype, "handedness", 1);
  var _a7;
  var LightComponent = (_a7 = class extends Component3 {
    getColor(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_light_component_get_color(this._id) / 4;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
    }
    setColor(c) {
      let wasm = this.engine.wasm, ptr = wasm._wl_light_component_get_color(this._id) / 4;
      wasm.HEAPF32[ptr] = c[0], wasm.HEAPF32[ptr + 1] = c[1], wasm.HEAPF32[ptr + 2] = c[2];
    }
    get color() {
      let wasm = this.engine.wasm;
      return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_light_component_get_color(this._id), 3);
    }
    set color(c) {
      this.color.set(c);
    }
    get lightType() {
      return this.engine.wasm._wl_light_component_get_type(this._id);
    }
    set lightType(t) {
      this.engine.wasm._wl_light_component_set_type(this._id, t);
    }
    get intensity() {
      return this.engine.wasm._wl_light_component_get_intensity(this._id);
    }
    set intensity(intensity) {
      this.engine.wasm._wl_light_component_set_intensity(this._id, intensity);
    }
    get outerAngle() {
      return this.engine.wasm._wl_light_component_get_outerAngle(this._id);
    }
    set outerAngle(angle2) {
      this.engine.wasm._wl_light_component_set_outerAngle(this._id, angle2);
    }
    get innerAngle() {
      return this.engine.wasm._wl_light_component_get_innerAngle(this._id);
    }
    set innerAngle(angle2) {
      this.engine.wasm._wl_light_component_set_innerAngle(this._id, angle2);
    }
    get shadows() {
      return !!this.engine.wasm._wl_light_component_get_shadows(this._id);
    }
    set shadows(b) {
      this.engine.wasm._wl_light_component_set_shadows(this._id, b);
    }
    get shadowRange() {
      return this.engine.wasm._wl_light_component_get_shadowRange(this._id);
    }
    set shadowRange(range) {
      this.engine.wasm._wl_light_component_set_shadowRange(this._id, range);
    }
    get shadowBias() {
      return this.engine.wasm._wl_light_component_get_shadowBias(this._id);
    }
    set shadowBias(bias) {
      this.engine.wasm._wl_light_component_set_shadowBias(this._id, bias);
    }
    get shadowNormalBias() {
      return this.engine.wasm._wl_light_component_get_shadowNormalBias(this._id);
    }
    set shadowNormalBias(bias) {
      this.engine.wasm._wl_light_component_set_shadowNormalBias(this._id, bias);
    }
    get shadowTexelSize() {
      return this.engine.wasm._wl_light_component_get_shadowTexelSize(this._id);
    }
    set shadowTexelSize(size) {
      this.engine.wasm._wl_light_component_set_shadowTexelSize(this._id, size);
    }
    get cascadeCount() {
      return this.engine.wasm._wl_light_component_get_cascadeCount(this._id);
    }
    set cascadeCount(count) {
      this.engine.wasm._wl_light_component_set_cascadeCount(this._id, count);
    }
  }, __publicField(_a7, "TypeName", "light"), _a7);
  __decorateClass([nativeProperty()], LightComponent.prototype, "color", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "lightType", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "intensity", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "outerAngle", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "innerAngle", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadows", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowRange", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowBias", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowNormalBias", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "shadowTexelSize", 1), __decorateClass([nativeProperty()], LightComponent.prototype, "cascadeCount", 1);
  var _a8;
  var AnimationComponent = (_a8 = class extends Component3 {
    onEvent = new Emitter();
    set animation(anim) {
      this.scene.assertOrigin(anim), this.engine.wasm._wl_animation_component_set_animation(this._id, anim ? anim._id : 0);
    }
    get animation() {
      let index = this.engine.wasm._wl_animation_component_get_animation(this._id);
      return this._scene.animations.wrap(index);
    }
    set playCount(playCount) {
      this.engine.wasm._wl_animation_component_set_playCount(this._id, playCount);
    }
    get playCount() {
      return this.engine.wasm._wl_animation_component_get_playCount(this._id);
    }
    set speed(speed) {
      this.engine.wasm._wl_animation_component_set_speed(this._id, speed);
    }
    get speed() {
      return this.engine.wasm._wl_animation_component_get_speed(this._id);
    }
    get state() {
      return this.engine.wasm._wl_animation_component_state(this._id);
    }
    get rootMotionMode() {
      return this.engine.wasm._wl_animation_component_get_rootMotionMode(this._id);
    }
    set rootMotionMode(mode) {
      this.engine.wasm._wl_animation_component_set_rootMotionMode(this._id, mode);
    }
    get iteration() {
      return this.engine.wasm._wl_animation_component_get_iteration(this._id);
    }
    get position() {
      return this.engine.wasm._wl_animation_component_get_position(this._id);
    }
    get duration() {
      return this.engine.wasm._wl_animation_component_get_duration(this._id);
    }
    play() {
      this.engine.wasm._wl_animation_component_play(this._id);
    }
    stop() {
      this.engine.wasm._wl_animation_component_stop(this._id);
    }
    pause() {
      this.engine.wasm._wl_animation_component_pause(this._id);
    }
    getFloatParameter(name) {
      let wasm = this.engine.wasm, index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
      if (index === -1)
        throw Error(`Missing parameter '${name}'`);
      return wasm._wl_animation_component_getGraphParamValue(this._id, index, wasm._tempMem), wasm._tempMemFloat[0];
    }
    setFloatParameter(name, value) {
      let wasm = this.engine.wasm, index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
      if (index === -1)
        throw Error(`Missing parameter '${name}'`);
      wasm._tempMemFloat[0] = value, wasm._wl_animation_component_setGraphParamValue(this._id, index, wasm._tempMem);
    }
    getRootMotionTranslation(out = new Float32Array(3)) {
      let wasm = this.engine.wasm;
      return wasm._wl_animation_component_get_rootMotion_translation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
    }
    getRootMotionRotation(out = new Float32Array(3)) {
      let wasm = this.engine.wasm;
      return wasm._wl_animation_component_get_rootMotion_rotation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
    }
  }, __publicField(_a8, "TypeName", "animation"), _a8);
  __decorateClass([nativeProperty()], AnimationComponent.prototype, "animation", 1), __decorateClass([nativeProperty()], AnimationComponent.prototype, "playCount", 1), __decorateClass([nativeProperty()], AnimationComponent.prototype, "speed", 1), __decorateClass([enumerable()], AnimationComponent.prototype, "state", 1), __decorateClass([nativeProperty(), enumerable()], AnimationComponent.prototype, "rootMotionMode", 1);
  var _a9;
  var MeshComponent = (_a9 = class extends Component3 {
    set material(material) {
      this.engine.wasm._wl_mesh_component_set_material(this._id, material ? material._id : 0);
    }
    get material() {
      let index = this.engine.wasm._wl_mesh_component_get_material(this._id);
      return this.engine.materials.wrap(index);
    }
    get mesh() {
      let index = this.engine.wasm._wl_mesh_component_get_mesh(this._id);
      return this.engine.meshes.wrap(index);
    }
    set mesh(mesh) {
      this.engine.wasm._wl_mesh_component_set_mesh(this._id, mesh?._id ?? 0);
    }
    get skin() {
      let index = this.engine.wasm._wl_mesh_component_get_skin(this._id);
      return this._scene.skins.wrap(index);
    }
    set skin(skin) {
      this.scene.assertOrigin(skin), this.engine.wasm._wl_mesh_component_set_skin(this._id, skin ? skin._id : 0);
    }
    get morphTargets() {
      let index = this.engine.wasm._wl_mesh_component_get_morph_targets(this._id);
      return this.engine.morphTargets.wrap(index);
    }
    set morphTargets(morphTargets) {
      this.engine.wasm._wl_mesh_component_set_morph_targets(this._id, morphTargets?._id ?? 0);
    }
    get morphTargetWeights() {
      return this.getMorphTargetWeights();
    }
    set morphTargetWeights(weights) {
      this.setMorphTargetWeights(weights);
    }
    getMorphTargetWeights(out) {
      let wasm = this.engine.wasm, count = wasm._wl_mesh_component_get_morph_target_weights(this._id, wasm._tempMem);
      out || (out = new Float32Array(count));
      for (let i = 0; i < count; ++i)
        out[i] = wasm._tempMemFloat[i];
      return out;
    }
    getMorphTargetWeight(target) {
      let count = this.morphTargets?.count ?? 0;
      if (target >= count)
        throw new Error(`Index ${target} is out of bounds for ${count} targets`);
      return this.engine.wasm._wl_mesh_component_get_morph_target_weight(this._id, target);
    }
    setMorphTargetWeights(weights) {
      let count = this.morphTargets?.count ?? 0;
      if (weights.length !== count)
        throw new Error(`Expected ${count} weights but got ${weights.length}`);
      let wasm = this.engine.wasm;
      wasm._tempMemFloat.set(weights), wasm._wl_mesh_component_set_morph_target_weights(this._id, wasm._tempMem, weights.length);
    }
    setMorphTargetWeight(target, weight) {
      let count = this.morphTargets?.count ?? 0;
      if (target >= count)
        throw new Error(`Index ${target} is out of bounds for ${count} targets`);
      this.engine.wasm._wl_mesh_component_set_morph_target_weight(this._id, target, weight);
    }
  }, __publicField(_a9, "TypeName", "mesh"), _a9);
  __decorateClass([nativeProperty()], MeshComponent.prototype, "material", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "mesh", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "skin", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "morphTargets", 1), __decorateClass([nativeProperty()], MeshComponent.prototype, "morphTargetWeights", 1);
  var LockAxis = ((LockAxis2) => (LockAxis2[LockAxis2.None = 0] = "None", LockAxis2[LockAxis2.X = 1] = "X", LockAxis2[LockAxis2.Y = 2] = "Y", LockAxis2[LockAxis2.Z = 4] = "Z", LockAxis2))(LockAxis || {});
  var _a10;
  var PhysXComponent = (_a10 = class extends Component3 {
    getTranslationOffset(out = new Float32Array(3)) {
      let wasm = this.engine.wasm;
      return wasm._wl_physx_component_get_offsetTranslation(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out;
    }
    getRotationOffset(out = new Float32Array(4)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_offsetTransform(this._id) >> 2;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out[3] = wasm.HEAPF32[ptr + 3], out;
    }
    getExtents(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_extents(this._id) / 4;
      return out[0] = wasm.HEAPF32[ptr], out[1] = wasm.HEAPF32[ptr + 1], out[2] = wasm.HEAPF32[ptr + 2], out;
    }
    getLinearVelocity(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, tempMemFloat = wasm._tempMemFloat;
      return wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem), out[0] = tempMemFloat[0], out[1] = tempMemFloat[1], out[2] = tempMemFloat[2], out;
    }
    getAngularVelocity(out = new Float32Array(3)) {
      let wasm = this.engine.wasm, tempMemFloat = wasm._tempMemFloat;
      return wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem), out[0] = tempMemFloat[0], out[1] = tempMemFloat[1], out[2] = tempMemFloat[2], out;
    }
    set static(b) {
      this.engine.wasm._wl_physx_component_set_static(this._id, b);
    }
    get static() {
      return !!this.engine.wasm._wl_physx_component_get_static(this._id);
    }
    get translationOffset() {
      return this.getTranslationOffset();
    }
    set translationOffset(offset2) {
      this.engine.wasm._wl_physx_component_set_offsetTranslation(this._id, offset2[0], offset2[1], offset2[2]);
    }
    get rotationOffset() {
      return this.getRotationOffset();
    }
    set rotationOffset(offset2) {
      this.engine.wasm._wl_physx_component_set_offsetRotation(this._id, offset2[0], offset2[1], offset2[2], offset2[3]);
    }
    set kinematic(b) {
      this.engine.wasm._wl_physx_component_set_kinematic(this._id, b);
    }
    get kinematic() {
      return !!this.engine.wasm._wl_physx_component_get_kinematic(this._id);
    }
    set gravity(b) {
      this.engine.wasm._wl_physx_component_set_gravity(this._id, b);
    }
    get gravity() {
      return !!this.engine.wasm._wl_physx_component_get_gravity(this._id);
    }
    set simulate(b) {
      this.engine.wasm._wl_physx_component_set_simulate(this._id, b);
    }
    get simulate() {
      return !!this.engine.wasm._wl_physx_component_get_simulate(this._id);
    }
    set allowSimulation(b) {
      this.engine.wasm._wl_physx_component_set_allowSimulation(this._id, b);
    }
    get allowSimulation() {
      return !!this.engine.wasm._wl_physx_component_get_allowSimulation(this._id);
    }
    set allowQuery(b) {
      this.engine.wasm._wl_physx_component_set_allowQuery(this._id, b);
    }
    get allowQuery() {
      return !!this.engine.wasm._wl_physx_component_get_allowQuery(this._id);
    }
    set trigger(b) {
      this.engine.wasm._wl_physx_component_set_trigger(this._id, b);
    }
    get trigger() {
      return !!this.engine.wasm._wl_physx_component_get_trigger(this._id);
    }
    set shape(s) {
      this.engine.wasm._wl_physx_component_set_shape(this._id, s);
    }
    get shape() {
      return this.engine.wasm._wl_physx_component_get_shape(this._id);
    }
    set shapeData(d) {
      d == null || !isMeshShape(this.shape) || this.engine.wasm._wl_physx_component_set_shape_data(this._id, d.index);
    }
    get shapeData() {
      return isMeshShape(this.shape) ? { index: this.engine.wasm._wl_physx_component_get_shape_data(this._id) } : null;
    }
    set extents(e) {
      this.extents.set(e);
    }
    get extents() {
      let wasm = this.engine.wasm, ptr = wasm._wl_physx_component_get_extents(this._id);
      return new Float32Array(wasm.HEAPF32.buffer, ptr, 3);
    }
    get staticFriction() {
      return this.engine.wasm._wl_physx_component_get_staticFriction(this._id);
    }
    set staticFriction(v) {
      this.engine.wasm._wl_physx_component_set_staticFriction(this._id, v);
    }
    get dynamicFriction() {
      return this.engine.wasm._wl_physx_component_get_dynamicFriction(this._id);
    }
    set dynamicFriction(v) {
      this.engine.wasm._wl_physx_component_set_dynamicFriction(this._id, v);
    }
    get bounciness() {
      return this.engine.wasm._wl_physx_component_get_bounciness(this._id);
    }
    set bounciness(v) {
      this.engine.wasm._wl_physx_component_set_bounciness(this._id, v);
    }
    get linearDamping() {
      return this.engine.wasm._wl_physx_component_get_linearDamping(this._id);
    }
    set linearDamping(v) {
      this.engine.wasm._wl_physx_component_set_linearDamping(this._id, v);
    }
    get angularDamping() {
      return this.engine.wasm._wl_physx_component_get_angularDamping(this._id);
    }
    set angularDamping(v) {
      this.engine.wasm._wl_physx_component_set_angularDamping(this._id, v);
    }
    set linearVelocity(v) {
      this.engine.wasm._wl_physx_component_set_linearVelocity(this._id, v[0], v[1], v[2]);
    }
    get linearVelocity() {
      let wasm = this.engine.wasm;
      return wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem), new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
    }
    set angularVelocity(v) {
      this.engine.wasm._wl_physx_component_set_angularVelocity(this._id, v[0], v[1], v[2]);
    }
    get angularVelocity() {
      let wasm = this.engine.wasm;
      return wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem), new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
    }
    set groupsMask(flags) {
      this.engine.wasm._wl_physx_component_set_groupsMask(this._id, flags);
    }
    get groupsMask() {
      return this.engine.wasm._wl_physx_component_get_groupsMask(this._id);
    }
    set blocksMask(flags) {
      this.engine.wasm._wl_physx_component_set_blocksMask(this._id, flags);
    }
    get blocksMask() {
      return this.engine.wasm._wl_physx_component_get_blocksMask(this._id);
    }
    set linearLockAxis(lock) {
      this.engine.wasm._wl_physx_component_set_linearLockAxis(this._id, lock);
    }
    get linearLockAxis() {
      return this.engine.wasm._wl_physx_component_get_linearLockAxis(this._id);
    }
    set angularLockAxis(lock) {
      this.engine.wasm._wl_physx_component_set_angularLockAxis(this._id, lock);
    }
    get angularLockAxis() {
      return this.engine.wasm._wl_physx_component_get_angularLockAxis(this._id);
    }
    set mass(m) {
      this.engine.wasm._wl_physx_component_set_mass(this._id, m);
    }
    get mass() {
      return this.engine.wasm._wl_physx_component_get_mass(this._id);
    }
    set massSpaceInteriaTensor(v) {
      this.engine.wasm._wl_physx_component_set_massSpaceInertiaTensor(this._id, v[0], v[1], v[2]);
    }
    set sleepOnActivate(flag) {
      this.engine.wasm._wl_physx_component_set_sleepOnActivate(this._id, flag);
    }
    get sleepOnActivate() {
      return !!this.engine.wasm._wl_physx_component_get_sleepOnActivate(this._id);
    }
    addForce(f2, m = 0, localForce = false, p, local = false) {
      let wasm = this.engine.wasm;
      if (!p) {
        wasm._wl_physx_component_addForce(this._id, f2[0], f2[1], f2[2], m, localForce);
        return;
      }
      wasm._wl_physx_component_addForceAt(this._id, f2[0], f2[1], f2[2], m, localForce, p[0], p[1], p[2], local);
    }
    addTorque(f2, m = 0) {
      this.engine.wasm._wl_physx_component_addTorque(this._id, f2[0], f2[1], f2[2], m);
    }
    onCollision(callback) {
      return this.onCollisionWith(this, callback);
    }
    onCollisionWith(otherComp, callback) {
      let callbacks = this.scene._pxCallbacks;
      return callbacks.has(this._id) || callbacks.set(this._id, []), callbacks.get(this._id).push(callback), this.engine.wasm._wl_physx_component_addCallback(this._id, otherComp._id);
    }
    removeCollisionCallback(callbackId) {
      let r = this.engine.wasm._wl_physx_component_removeCallback(this._id, callbackId), callbacks = this.scene._pxCallbacks;
      r && callbacks.get(this._id).splice(-r);
    }
  }, __publicField(_a10, "TypeName", "physx"), _a10);
  __decorateClass([nativeProperty()], PhysXComponent.prototype, "static", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "translationOffset", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "rotationOffset", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "kinematic", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "gravity", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "simulate", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "allowSimulation", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "allowQuery", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "trigger", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "shape", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "shapeData", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "extents", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "staticFriction", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "dynamicFriction", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "bounciness", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "linearDamping", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "angularDamping", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "linearVelocity", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "angularVelocity", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "groupsMask", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "blocksMask", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "linearLockAxis", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "angularLockAxis", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "mass", 1), __decorateClass([nativeProperty()], PhysXComponent.prototype, "sleepOnActivate", 1);
  var MeshIndexType = ((MeshIndexType2) => (MeshIndexType2[MeshIndexType2.UnsignedByte = 1] = "UnsignedByte", MeshIndexType2[MeshIndexType2.UnsignedShort = 2] = "UnsignedShort", MeshIndexType2[MeshIndexType2.UnsignedInt = 4] = "UnsignedInt", MeshIndexType2))(MeshIndexType || {});
  var MeshSkinningType = ((MeshSkinningType2) => (MeshSkinningType2[MeshSkinningType2.None = 0] = "None", MeshSkinningType2[MeshSkinningType2.FourJoints = 1] = "FourJoints", MeshSkinningType2[MeshSkinningType2.EightJoints = 2] = "EightJoints", MeshSkinningType2))(MeshSkinningType || {});
  var Mesh = class extends Resource {
    constructor(engine, params) {
      if (!isNumber(params)) {
        let mesh = engine.meshes.create(params);
        return super(engine, mesh._index), mesh;
      }
      super(engine, params);
    }
    get vertexCount() {
      return this.engine.wasm._wl_mesh_get_vertexCount(this._id);
    }
    get indexData() {
      let wasm = this.engine.wasm, tempMem = wasm._tempMem, ptr = wasm._wl_mesh_get_indexData(this._id, tempMem, tempMem + 4);
      if (ptr === null)
        return null;
      let indexCount = wasm.HEAPU32[tempMem / 4];
      switch (wasm.HEAPU32[tempMem / 4 + 1]) {
        case 1:
          return new Uint8Array(wasm.HEAPU8.buffer, ptr, indexCount);
        case 2:
          return new Uint16Array(wasm.HEAPU16.buffer, ptr, indexCount);
        case 4:
          return new Uint32Array(wasm.HEAPU32.buffer, ptr, indexCount);
      }
      return null;
    }
    update() {
      this.engine.wasm._wl_mesh_update(this._id);
    }
    getBoundingSphere(out = new Float32Array(4)) {
      let wasm = this.engine.wasm;
      return this.engine.wasm._wl_mesh_get_boundingSphere(this._id, wasm._tempMem), out[0] = wasm._tempMemFloat[0], out[1] = wasm._tempMemFloat[1], out[2] = wasm._tempMemFloat[2], out[3] = wasm._tempMemFloat[3], out;
    }
    attribute(attr) {
      if (typeof attr != "number")
        throw new TypeError("Expected number, but got " + typeof attr);
      let wasm = this.engine.wasm, tempMemUint32 = wasm._tempMemUint32;
      if (wasm._wl_mesh_get_attribute(this._id, attr, wasm._tempMem), tempMemUint32[0] == 255)
        return null;
      let arraySize = tempMemUint32[5];
      return new MeshAttributeAccessor(this.engine, { attribute: tempMemUint32[0], offset: tempMemUint32[1], stride: tempMemUint32[2], formatSize: tempMemUint32[3], componentCount: tempMemUint32[4], arraySize: arraySize || 1, length: this.vertexCount, bufferType: attr !== 5 ? Float32Array : Uint16Array });
    }
    destroy() {
      this.engine.wasm._wl_mesh_destroy(this._id), this.engine.meshes._destroy(this);
    }
    toString() {
      return this.isDestroyed ? "Mesh(destroyed)" : `Mesh(${this._index})`;
    }
  };
  var MeshAttributeAccessor = class {
    length = 0;
    _engine;
    _attribute = -1;
    _offset = 0;
    _stride = 0;
    _formatSize = 0;
    _componentCount = 0;
    _arraySize = 1;
    _bufferType;
    _tempBufferGetter;
    constructor(engine, options) {
      this._engine = engine;
      let wasm = this._engine.wasm;
      this._attribute = options.attribute, this._offset = options.offset, this._stride = options.stride, this._formatSize = options.formatSize, this._componentCount = options.componentCount, this._arraySize = options.arraySize, this._bufferType = options.bufferType, this.length = options.length, this._tempBufferGetter = this._bufferType === Float32Array ? wasm.getTempBufferF32.bind(wasm) : wasm.getTempBufferU16.bind(wasm);
    }
    createArray(count = 1) {
      return count = count > this.length ? this.length : count, new this._bufferType(count * this._componentCount * this._arraySize);
    }
    get(index, out = this.createArray()) {
      if (out.length % this._componentCount !== 0)
        throw new Error(`out.length, ${out.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
      let dest = this._tempBufferGetter(out.length), elementSize = this._bufferType.BYTES_PER_ELEMENT, destSize = elementSize * out.length, srcFormatSize = this._formatSize * this._arraySize, destFormatSize = this._componentCount * elementSize * this._arraySize;
      this._engine.wasm._wl_mesh_get_attribute_values(this._attribute, srcFormatSize, this._offset + index * this._stride, this._stride, destFormatSize, dest.byteOffset, destSize);
      for (let i = 0; i < out.length; ++i)
        out[i] = dest[i];
      return out;
    }
    set(i, v) {
      if (v.length % this._componentCount !== 0)
        throw new Error(`out.length, ${v.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
      let elementSize = this._bufferType.BYTES_PER_ELEMENT, srcSize = elementSize * v.length, srcFormatSize = this._componentCount * elementSize * this._arraySize, destFormatSize = this._formatSize * this._arraySize, wasm = this._engine.wasm;
      if (v.buffer != wasm.HEAPU8.buffer) {
        let dest = this._tempBufferGetter(v.length);
        dest.set(v), v = dest;
      }
      return wasm._wl_mesh_set_attribute_values(this._attribute, srcFormatSize, v.byteOffset, srcSize, destFormatSize, this._offset + i * this._stride, this._stride), this;
    }
    get engine() {
      return this._engine;
    }
  };
  var temp2d = null;
  var Texture = class extends Resource {
    constructor(engine, param) {
      if (isImageLike(param)) {
        let texture = engine.textures.create(param);
        return super(engine, texture._index), texture;
      }
      super(engine, param);
    }
    get valid() {
      return !this.isDestroyed;
    }
    get id() {
      return this.index;
    }
    update() {
      let image = this._imageIndex;
      !this.valid || !image || this.engine.wasm._wl_renderer_updateImage(image);
    }
    get width() {
      let element = this.htmlElement;
      if (element)
        return element.width;
      let wasm = this.engine.wasm;
      return wasm._wl_image_size(this._imageIndex, wasm._tempMem), wasm._tempMemUint32[0];
    }
    get height() {
      let element = this.htmlElement;
      if (element)
        return element.height;
      let wasm = this.engine.wasm;
      return wasm._wl_image_size(this._imageIndex, wasm._tempMem), wasm._tempMemUint32[1];
    }
    get htmlElement() {
      let image = this._imageIndex;
      if (!image)
        return null;
      let wasm = this.engine.wasm, jsImageIndex = wasm._wl_image_get_jsImage_index(image);
      return wasm._images[jsImageIndex];
    }
    updateSubImage(x, y, w, h) {
      if (this.isDestroyed)
        return;
      let image = this._imageIndex;
      if (!image)
        return;
      let wasm = this.engine.wasm, jsImageIndex = wasm._wl_image_get_jsImage_index(image);
      if (!temp2d) {
        let canvas2 = document.createElement("canvas"), ctx = canvas2.getContext("2d");
        if (!ctx)
          throw new Error("Texture.updateSubImage(): Failed to obtain CanvasRenderingContext2D.");
        temp2d = { canvas: canvas2, ctx };
      }
      let img = wasm._images[jsImageIndex];
      if (!img)
        return;
      temp2d.canvas.width = w, temp2d.canvas.height = h, temp2d.ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      let yOffset = (img.videoHeight ?? img.height) - y - h;
      wasm._images[jsImageIndex] = temp2d.canvas, wasm._wl_renderer_updateImage(image, x, yOffset), wasm._images[jsImageIndex] = img;
    }
    destroy() {
      this.engine.wasm._wl_texture_destroy(this._id), this.engine.textures._destroy(this);
    }
    toString() {
      return this.isDestroyed ? "Texture(destroyed)" : `Texture(${this._index})`;
    }
    get _imageIndex() {
      return this.engine.wasm._wl_texture_get_image_index(this._id);
    }
  };
  var XR = class {
    #wasm;
    #mode;
    constructor(wasm, mode) {
      this.#wasm = wasm, this.#mode = mode;
    }
    get sessionMode() {
      return this.#mode;
    }
    get session() {
      return this.#wasm.webxr_session;
    }
    get frame() {
      return this.#wasm.webxr_frame;
    }
    referenceSpaceForType(type) {
      return this.#wasm.webxr_refSpaces[type] ?? null;
    }
    set currentReferenceSpace(refSpace) {
      this.#wasm.webxr_refSpace = refSpace, this.#wasm.webxr_refSpaceType = null;
      for (let type of Object.keys(this.#wasm.webxr_refSpaces))
        this.#wasm.webxr_refSpaces[type] === refSpace && (this.#wasm.webxr_refSpaceType = type);
    }
    get currentReferenceSpace() {
      return this.#wasm.webxr_refSpace;
    }
    get currentReferenceSpaceType() {
      return this.#wasm.webxr_refSpaceType;
    }
    get baseLayer() {
      return this.#wasm.webxr_baseLayer;
    }
    get framebuffers() {
      return Array.isArray(this.#wasm.webxr_fbo) ? this.#wasm.webxr_fbo.map((id) => this.#wasm.GL.framebuffers[id]) : [this.#wasm.GL.framebuffers[this.#wasm.webxr_fbo]];
    }
  };
  var MaterialParamType = ((MaterialParamType2) => (MaterialParamType2[MaterialParamType2.UnsignedInt = 0] = "UnsignedInt", MaterialParamType2[MaterialParamType2.Int = 1] = "Int", MaterialParamType2[MaterialParamType2.HalfFloat = 2] = "HalfFloat", MaterialParamType2[MaterialParamType2.Float = 3] = "Float", MaterialParamType2[MaterialParamType2.Sampler = 4] = "Sampler", MaterialParamType2[MaterialParamType2.Font = 5] = "Font", MaterialParamType2))(MaterialParamType || {});
  var _a11;
  var Material = (_a11 = class extends Resource {
    constructor(engine, params) {
      if (typeof params != "number") {
        if (!params?.pipeline)
          throw new Error("Missing parameter 'pipeline'");
        let template = engine.materials.getTemplate(params.pipeline), material = new template();
        return super(engine, material._index), material;
      }
      super(engine, params);
    }
    hasParameter(name) {
      let parameters = this.constructor.Parameters;
      return parameters && parameters.has(name);
    }
    get shader() {
      return this.pipeline;
    }
    get pipeline() {
      let wasm = this.engine.wasm;
      return wasm.UTF8ToString(wasm._wl_material_get_pipeline(this._id));
    }
    clone() {
      let index = this.engine.wasm._wl_material_clone(this._id);
      return this.engine.materials.wrap(index);
    }
    toString() {
      return this.isDestroyed ? "Material(destroyed)" : `Material('${this.pipeline}', ${this._index})`;
    }
    static wrap(engine, index) {
      return engine.materials.wrap(index);
    }
  }, __publicField(_a11, "_destroyedPrototype", createDestroyedProxy2("material")), _a11);
  var SceneType = ((SceneType2) => (SceneType2[SceneType2.Prefab = 0] = "Prefab", SceneType2[SceneType2.Main = 1] = "Main", SceneType2[SceneType2.Dependency = 2] = "Dependency", SceneType2))(SceneType || {});
  function assert(bit) {
    if (bit >= 32)
      throw new Error(`BitSet.enable(): Value ${bit} is over 31`);
  }
  var BitSet = class {
    _bits = 0;
    enable(...bits) {
      for (let bit of bits)
        assert(bit), this._bits |= 1 << bit >>> 0;
      return this;
    }
    enableAll() {
      return this._bits = -1, this;
    }
    disable(...bits) {
      for (let bit of bits)
        assert(bit), this._bits &= ~(1 << bit >>> 0);
      return this;
    }
    disableAll() {
      return this._bits = 0, this;
    }
    enabled(bit) {
      return !!(this._bits & 1 << bit >>> 0);
    }
  };
  var LogLevel = ((LogLevel2) => (LogLevel2[LogLevel2.Info = 0] = "Info", LogLevel2[LogLevel2.Warn = 1] = "Warn", LogLevel2[LogLevel2.Error = 2] = "Error", LogLevel2))(LogLevel || {});
  var Logger = class {
    levels = new BitSet();
    tags = new BitSet().enableAll();
    constructor(...levels) {
      this.levels.enable(...levels);
    }
    info(tag, ...msg) {
      return this.levels.enabled(0) && this.tags.enabled(tag) && console.log(...msg), this;
    }
    warn(tag, ...msg) {
      return this.levels.enabled(1) && this.tags.enabled(tag) && console.warn(...msg), this;
    }
    error(tag, ...msg) {
      return this.levels.enabled(2) && this.tags.enabled(tag) && console.error(...msg), this;
    }
  };
  function decode(data, tagger = (_, value) => value, options = {}) {
    let { dictionary = "object" } = options, dataView = new DataView(data.buffer, data.byteOffset, data.byteLength), offset2 = 0;
    function commitRead(length5, value) {
      return offset2 += length5, value;
    }
    function readArrayBuffer(length5) {
      return commitRead(length5, data.subarray(offset2, offset2 + length5));
    }
    function readFloat16() {
      let POW_2_24 = 5960464477539063e-23, tempArrayBuffer = new ArrayBuffer(4), tempDataView = new DataView(tempArrayBuffer), value = readUint16(), sign = value & 32768, exponent = value & 31744, fraction = value & 1023;
      if (exponent === 31744)
        exponent = 261120;
      else if (exponent !== 0)
        exponent += 114688;
      else if (fraction !== 0)
        return (sign ? -1 : 1) * fraction * POW_2_24;
      return tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13), tempDataView.getFloat32(0);
    }
    function readFloat32() {
      return commitRead(4, dataView.getFloat32(offset2));
    }
    function readFloat64() {
      return commitRead(8, dataView.getFloat64(offset2));
    }
    function readUint8() {
      return commitRead(1, data[offset2]);
    }
    function readUint16() {
      return commitRead(2, dataView.getUint16(offset2));
    }
    function readUint32() {
      return commitRead(4, dataView.getUint32(offset2));
    }
    function readUint64() {
      return commitRead(8, dataView.getBigUint64(offset2));
    }
    function readBreak() {
      return data[offset2] !== 255 ? false : (offset2 += 1, true);
    }
    function readLength(additionalInformation) {
      if (additionalInformation < 24)
        return additionalInformation;
      if (additionalInformation === 24)
        return readUint8();
      if (additionalInformation === 25)
        return readUint16();
      if (additionalInformation === 26)
        return readUint32();
      if (additionalInformation === 27) {
        let integer = readUint64();
        return integer <= Number.MAX_SAFE_INTEGER ? Number(integer) : integer;
      }
      if (additionalInformation === 31)
        return -1;
      throw new Error("CBORError: Invalid length encoding");
    }
    function readIndefiniteStringLength(majorType) {
      let initialByte = readUint8();
      if (initialByte === 255)
        return -1;
      let length5 = readLength(initialByte & 31);
      if (length5 < 0 || initialByte >> 5 !== majorType)
        throw new Error("CBORError: Invalid indefinite length element");
      return Number(length5);
    }
    function appendUtf16Data(utf16data, length5) {
      for (let i = 0; i < length5; ++i) {
        let value = readUint8();
        value & 128 && (value < 224 ? (value = (value & 31) << 6 | readUint8() & 63, length5 -= 1) : value < 240 ? (value = (value & 15) << 12 | (readUint8() & 63) << 6 | readUint8() & 63, length5 -= 2) : (value = (value & 7) << 18 | (readUint8() & 63) << 12 | (readUint8() & 63) << 6 | readUint8() & 63, length5 -= 3)), value < 65536 ? utf16data.push(value) : (value -= 65536, utf16data.push(55296 | value >> 10), utf16data.push(56320 | value & 1023));
      }
    }
    function decodeItem() {
      let initialByte = readUint8(), majorType = initialByte >> 5, additionalInformation = initialByte & 31, i, length5;
      if (majorType === 7)
        switch (additionalInformation) {
          case 25:
            return readFloat16();
          case 26:
            return readFloat32();
          case 27:
            return readFloat64();
        }
      if (length5 = readLength(additionalInformation), length5 < 0 && (majorType < 2 || 6 < majorType))
        throw new Error("CBORError: Invalid length");
      switch (majorType) {
        case 0:
          return length5;
        case 1:
          return typeof length5 == "number" ? -1 - length5 : -1n - length5;
        case 2: {
          if (length5 < 0) {
            let elements = [], fullArrayLength = 0;
            for (; (length5 = readIndefiniteStringLength(majorType)) >= 0; )
              fullArrayLength += length5, elements.push(readArrayBuffer(length5));
            let fullArray = new Uint8Array(fullArrayLength), fullArrayOffset = 0;
            for (i = 0; i < elements.length; ++i)
              fullArray.set(elements[i], fullArrayOffset), fullArrayOffset += elements[i].length;
            return fullArray;
          }
          return readArrayBuffer(length5).slice();
        }
        case 3: {
          let utf16data = [];
          if (length5 < 0)
            for (; (length5 = readIndefiniteStringLength(majorType)) >= 0; )
              appendUtf16Data(utf16data, length5);
          else
            appendUtf16Data(utf16data, length5);
          let string = "", DECODE_CHUNK_SIZE = 8192;
          for (i = 0; i < utf16data.length; i += DECODE_CHUNK_SIZE)
            string += String.fromCharCode.apply(null, utf16data.slice(i, i + DECODE_CHUNK_SIZE));
          return string;
        }
        case 4: {
          let retArray;
          if (length5 < 0) {
            retArray = [];
            let index = 0;
            for (; !readBreak(); )
              retArray.push(decodeItem());
          } else
            for (retArray = new Array(length5), i = 0; i < length5; ++i)
              retArray[i] = decodeItem();
          return retArray;
        }
        case 5: {
          if (dictionary === "map") {
            let retMap = /* @__PURE__ */ new Map();
            for (i = 0; i < length5 || length5 < 0 && !readBreak(); ++i) {
              let key = decodeItem();
              if (retMap.has(key))
                throw new Error("CBORError: Duplicate key encountered");
              retMap.set(key, decodeItem());
            }
            return retMap;
          }
          let retObject = {};
          for (i = 0; i < length5 || length5 < 0 && !readBreak(); ++i) {
            let key = decodeItem();
            if (Object.prototype.hasOwnProperty.call(retObject, key))
              throw new Error("CBORError: Duplicate key encountered");
            retObject[key] = decodeItem();
          }
          return retObject;
        }
        case 6: {
          let value = decodeItem(), tag = length5;
          if (value instanceof Uint8Array)
            switch (tag) {
              case 2:
              case 3:
                let num = value.reduce((acc, n) => (acc << 8n) + BigInt(n), 0n);
                return tag == 3 && (num = -1n - num), num;
              case 64:
                return value;
              case 72:
                return new Int8Array(value.buffer);
              case 69:
                return new Uint16Array(value.buffer);
              case 77:
                return new Int16Array(value.buffer);
              case 70:
                return new Uint32Array(value.buffer);
              case 78:
                return new Int32Array(value.buffer);
              case 71:
                return new BigUint64Array(value.buffer);
              case 79:
                return new BigInt64Array(value.buffer);
              case 85:
                return new Float32Array(value.buffer);
              case 86:
                return new Float64Array(value.buffer);
            }
          return tagger(tag, value);
        }
        case 7:
          switch (length5) {
            case 20:
              return false;
            case 21:
              return true;
            case 22:
              return null;
            case 23:
              return;
            default:
              return length5;
          }
      }
    }
    let ret = decodeItem();
    if (offset2 !== data.byteLength)
      throw new Error("CBORError: Remaining bytes");
    return ret;
  }
  var CBOR = { decode };
  var _componentDefaults = /* @__PURE__ */ new Map([[1, false], [2, 0], [3, 0], [4, ""], [5, void 0], [6, null], [7, null], [8, null], [9, null], [10, null], [11, null], [12, Float32Array.from([0, 0, 0, 1])], [13, Float32Array.from([0, 0])], [14, Float32Array.from([0, 0, 0])], [15, Float32Array.from([0, 0, 0, 0])]]);
  function _setupDefaults(ctor) {
    for (let name in ctor.Properties) {
      let p = ctor.Properties[name];
      if (p.type === 5)
        p.values?.length ? (typeof p.default != "number" && (p.default = p.values.indexOf(p.default)), (p.default < 0 || p.default >= p.values.length) && (p.default = 0)) : p.default = void 0;
      else if ((p.type === 12 || p.type === 13 || p.type === 14 || p.type === 15) && Array.isArray(p.default))
        p.default = Float32Array.from(p.default);
      else if (p.default === void 0) {
        let cloner = p.cloner ?? defaultPropertyCloner;
        p.default = cloner.clone(p.type, _componentDefaults.get(p.type));
      }
      ctor.prototype[name] = p.default;
    }
  }
  function _setPropertyOrder(ctor) {
    ctor._propertyOrder = ctor.hasOwnProperty("Properties") ? Object.keys(ctor.Properties).sort() : [];
  }
  var WASM2 = class {
    worker = "";
    wasm = null;
    canvas = null;
    preinitializedWebGPUDevice = null;
    webxr_session = null;
    webxr_requestSession = null;
    webxr_offerSession = null;
    webxr_frame = null;
    webxr_refSpace = null;
    webxr_refSpaces = null;
    webxr_refSpaceType = null;
    webxr_baseLayer = null;
    webxr_framebufferScaleFactor = 1;
    webxr_fbo = 0;
    UTF8ViewToString;
    _log = new Logger();
    _deactivate_component_on_error = false;
    _tempMem = null;
    _tempMemSize = 0;
    _tempMemFloat = null;
    _tempMemInt = null;
    _tempMemUint8 = null;
    _tempMemUint32 = null;
    _tempMemUint16 = null;
    _loadingScreen = null;
    _sceneLoadedCallback = [];
    _images = [null];
    _components = null;
    _componentTypes = [];
    _componentTypeIndices = {};
    _engine = null;
    _withPhysX = false;
    _utf8Decoder = new TextDecoder("utf8");
    _brokenComponentIndex = 0;
    constructor(threads2) {
      threads2 ? this.UTF8ViewToString = (s, e) => s ? this._utf8Decoder.decode(this.HEAPU8.slice(s, e)) : "" : this.UTF8ViewToString = (s, e) => s ? this._utf8Decoder.decode(this.HEAPU8.subarray(s, e)) : "", this._brokenComponentIndex = this._registerComponent(BrokenComponent);
    }
    reset() {
      this._wl_reset(), this._components = null, this._images.length = 1, this.allocateTempMemory(1024), this._componentTypes = [], this._componentTypeIndices = {}, this._brokenComponentIndex = this._registerComponent(BrokenComponent);
    }
    isRegistered(type) {
      return type in this._componentTypeIndices;
    }
    _registerComponentLegacy(typeName, params, object) {
      let ctor = class extends Component3 {
      };
      return ctor.TypeName = typeName, ctor.Properties = params, Object.assign(ctor.prototype, object), this._registerComponent(ctor);
    }
    _registerComponent(ctor) {
      if (!ctor.TypeName)
        throw new Error("no name provided for component.");
      if (!ctor.prototype._triggerInit)
        throw new Error(`registerComponent(): Component ${ctor.TypeName} must extend Component`);
      inheritProperties(ctor), _setupDefaults(ctor), _setPropertyOrder(ctor);
      let typeIndex = ctor.TypeName in this._componentTypeIndices ? this._componentTypeIndices[ctor.TypeName] : this._componentTypes.length;
      return this._componentTypes[typeIndex] = ctor, this._componentTypeIndices[ctor.TypeName] = typeIndex, ctor === BrokenComponent || (this._log.info(0, "Registered component", ctor.TypeName, `(class ${ctor.name})`, "with index", typeIndex), ctor.onRegister && ctor.onRegister(this._engine)), typeIndex;
    }
    allocateTempMemory(size) {
      this._log.info(0, "Allocating temp mem:", size), this._tempMemSize = size, this._tempMem && this._free(this._tempMem), this._tempMem = this._malloc(this._tempMemSize), this.updateTempMemory();
    }
    requireTempMem(size) {
      this._tempMemSize >= size || this.allocateTempMemory(Math.ceil(size / 1024) * 1024);
    }
    updateTempMemory() {
      this._tempMemFloat = new Float32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemInt = new Int32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemUint32 = new Uint32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2), this._tempMemUint16 = new Uint16Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 1), this._tempMemUint8 = new Uint8Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize);
    }
    getTempBufferU8(count) {
      return this.requireTempMem(count), this._tempMemUint8;
    }
    getTempBufferU16(count) {
      return this.requireTempMem(count * 2), this._tempMemUint16;
    }
    getTempBufferU32(count) {
      return this.requireTempMem(count * 4), this._tempMemUint32;
    }
    getTempBufferI32(count) {
      return this.requireTempMem(count * 4), this._tempMemInt;
    }
    getTempBufferF32(count) {
      return this.requireTempMem(count * 4), this._tempMemFloat;
    }
    tempUTF8(str5, byteOffset = 0) {
      let strLen = this.lengthBytesUTF8(str5) + 1;
      this.requireTempMem(strLen + byteOffset);
      let ptr = this._tempMem + byteOffset;
      return this.stringToUTF8(str5, ptr, strLen), ptr;
    }
    copyBufferToHeap(buffer) {
      let size = buffer.byteLength, ptr = this._malloc(size);
      return this.HEAPU8.set(new Uint8Array(buffer), ptr), ptr;
    }
    get withPhysX() {
      return this._withPhysX;
    }
    _setEngine(engine) {
      this._engine = engine;
    }
    _wljs_xr_session_start(mode) {
      this._engine.xr === null && (this._engine.xr = new XR(this, mode), this._engine.onXRSessionStart.notify(this.webxr_session, mode));
    }
    _wljs_xr_session_end() {
      let startEmitter = this._engine.onXRSessionStart;
      startEmitter instanceof RetainEmitter && startEmitter.reset(), this._engine.onXRSessionEnd.notify(), this._engine.xr = null;
    }
    _wljs_xr_disable() {
      this._engine.arSupported = false, this._engine.vrSupported = false;
    }
    _wljs_init(withPhysX) {
      this._withPhysX = withPhysX, this.allocateTempMemory(1024);
    }
    _wljs_scene_switch(index) {
      let scene = this._engine._scenes[index];
      this._components = scene?._jsComponents ?? null;
    }
    _wljs_destroy_image(index) {
      let img = this._images[index];
      img && (this._images[index] = null, img.src !== void 0 && (img.src = ""), img.onload !== void 0 && (img.onload = null), img.onerror !== void 0 && (img.onerror = null));
    }
    _wljs_objects_markDestroyed(sceneIndex, idsPtr, count) {
      let scene = this._engine._scenes[sceneIndex], start = idsPtr >>> 1;
      for (let i = 0; i < count; ++i) {
        let id = this.HEAPU16[start + i];
        scene._destroyObject(id);
      }
    }
    _wljs_scene_initialize(sceneIndex, idsPtr, idsEnd, paramDataPtr, paramDataEndPtr, offsetsPtr, offsetsEndPtr) {
      let cbor = this.HEAPU8.subarray(paramDataPtr, paramDataEndPtr), offsets = this.HEAPU32.subarray(offsetsPtr >>> 2, offsetsEndPtr >>> 2), ids = this.HEAPU16.subarray(idsPtr >>> 1, idsEnd >>> 1), engine = this._engine, scene = engine._scenes[sceneIndex], components = scene._jsComponents, decoded;
      try {
        decoded = CBOR.decode(cbor);
      } catch (e) {
        this._log.error(0, "Exception during component parameter decoding"), this._log.error(2, e);
        return;
      }
      if (!Array.isArray(decoded)) {
        this._log.error(0, "Parameter data must be an array");
        return;
      }
      if (decoded.length !== ids.length) {
        this._log.error(0, `Parameter data has size ${decoded.length} but expected ${ids.length}`);
        return;
      }
      for (let i = 0; i < decoded.length; ++i) {
        let id = Component3._pack(sceneIndex, ids[i]), index = this._wl_get_js_component_index_for_id(id), component = components[index], ctor = component.constructor;
        if (ctor == BrokenComponent)
          continue;
        let paramNames = ctor._propertyOrder, paramValues = decoded[i];
        if (!Array.isArray(paramValues)) {
          this._log.error(0, "Component parameter data must be an array");
          continue;
        }
        if (paramValues.length !== paramNames.length) {
          this._log.error(0, `Component parameter data has size ${paramValues.length} but expected ${paramNames.length}`);
          continue;
        }
        for (let j = 0; j < paramValues.length; ++j) {
          let name = paramNames[j], property2 = ctor.Properties[name], type = property2.type, value = paramValues[j];
          if (value === void 0) {
            value = (property2.cloner ?? defaultPropertyCloner).clone(type, property2.default), component[name] = value;
            continue;
          }
          switch (typeof value == "number" && (value += offsets[type]), type) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 13:
            case 14:
            case 15:
              break;
            case 6:
              value = value ? scene.wrap(this._wl_object_id(scene._index, value)) : null;
              break;
            case 7:
              value = engine.meshes.wrap(value);
              break;
            case 8:
              value = engine.textures.wrap(value);
              break;
            case 9:
              value = engine.materials.wrap(value);
              break;
            case 10:
              value = scene.animations.wrap(value);
              break;
            case 11:
              value = scene.skins.wrap(value);
              break;
            case 12:
              let max2 = (1 << value.BYTES_PER_ELEMENT * 8) - 1;
              value = Float32Array.from(value, (f2, _) => f2 / max2);
              break;
          }
          component[name] = value;
        }
      }
    }
    _wljs_set_component_param_translation(scene, component, param, valuePtr, valueEndPtr) {
      let comp = this._engine._scenes[scene]._jsComponents[component], value = this.UTF8ViewToString(valuePtr, valueEndPtr), paramName = comp.constructor._propertyOrder[param];
      comp[paramName] = value;
    }
    _wljs_get_component_type_index(namePtr, nameEndPtr) {
      let typename = this.UTF8ViewToString(namePtr, nameEndPtr), index = this._componentTypeIndices[typename];
      return index === void 0 ? this._brokenComponentIndex : index;
    }
    _wljs_component_create(sceneIndex, index, id, type, object) {
      this._engine._scenes[sceneIndex]._components.createJs(index, id, type, object);
    }
    _wljs_component_init(scene, component) {
      this._engine._scenes[scene]._jsComponents[component]._triggerInit();
    }
    _wljs_component_update(component, dt) {
      this._components[component]._triggerUpdate(dt);
    }
    _wljs_component_onActivate(component) {
      this._components[component]._triggerOnActivate();
    }
    _wljs_component_onDeactivate(component) {
      this._components[component]._triggerOnDeactivate();
    }
    _wljs_component_markDestroyed(sceneIndex, manager, componentId) {
      this._engine._scenes[sceneIndex]._destroyComponent(manager, componentId);
    }
    _wljs_swap(scene, a, b) {
      let components = this._engine._scenes[scene]._jsComponents, componentA = components[a];
      components[a] = components[b], components[b] = componentA;
    }
    _wljs_copy(srcSceneIndex, srcIndex, dstSceneIndex, dstIndex, offsetsPtr) {
      let srcScene = this._engine._scenes[srcSceneIndex], destComp = this._engine._scenes[dstSceneIndex]._jsComponents[dstIndex], srcComp = srcScene._jsComponents[srcIndex];
      try {
        destComp._copy(srcComp, offsetsPtr);
      } catch (e) {
        this._log.error(2, `Exception during ${destComp.type} copy() on object ${destComp.object.name}`), this._log.error(2, e);
      }
    }
    _wljs_trigger_animationEvent(componentId, namePtr, nameEndPtr) {
      let comp = this._engine.scene._components.wrapAnimation(componentId), nameStr = this.UTF8ViewToString(namePtr, nameEndPtr);
      comp.onEvent.notify(nameStr);
    }
  };
  function throwInvalidRuntime(version) {
    return function() {
      throw new Error(`Feature added in version ${version}.
	\u2192 Please use a Wonderland Engine editor version >= ${version}`);
    };
  }
  var requireRuntime1_2_1 = throwInvalidRuntime("1.2.1");
  WASM2.prototype._wl_text_component_get_wrapMode = requireRuntime1_2_1;
  WASM2.prototype._wl_text_component_set_wrapMode = requireRuntime1_2_1;
  WASM2.prototype._wl_text_component_get_wrapWidth = requireRuntime1_2_1;
  WASM2.prototype._wl_text_component_set_wrapWidth = requireRuntime1_2_1;
  WASM2.prototype._wl_font_get_outlineSize = requireRuntime1_2_1;
  WASM2.prototype._wl_scene_create_chunked_start = requireRuntime1_2_1;
  WASM2.prototype._wl_scene_create_chunked_buffer_size = requireRuntime1_2_1;
  WASM2.prototype._wl_scene_create_chunked_next = requireRuntime1_2_1;
  WASM2.prototype._wl_scene_create_chunked_abort = requireRuntime1_2_1;
  WASM2.prototype._wl_scene_create_chunked_end_prefab = requireRuntime1_2_1;
  WASM2.prototype._wl_scene_create_chunked_end_main = requireRuntime1_2_1;
  WASM2.prototype._wl_scene_create_chunked_end_queued = requireRuntime1_2_1;
  var requireRuntime1_2_2 = throwInvalidRuntime("1.2.2");
  WASM2.prototype._wl_view_component_get_projectionType = requireRuntime1_2_2;
  WASM2.prototype._wl_view_component_set_projectionType = requireRuntime1_2_2;
  WASM2.prototype._wl_view_component_get_extent = requireRuntime1_2_2;
  WASM2.prototype._wl_view_component_set_extent = requireRuntime1_2_2;
  WASM2.prototype._wl_animation_component_get_rootMotionMode = requireRuntime1_2_2;
  WASM2.prototype._wl_animation_component_set_rootMotionMode = requireRuntime1_2_2;
  WASM2.prototype._wl_animation_component_get_rootMotion_translation = requireRuntime1_2_2;
  WASM2.prototype._wl_animation_component_get_rootMotion_rotation = requireRuntime1_2_2;
  var requireRuntime1_2_3 = throwInvalidRuntime("1.2.3");
  WASM2.prototype._wl_scene_environment_set_intensity = requireRuntime1_2_3;
  WASM2.prototype._wl_scene_environment_get_intensity = requireRuntime1_2_3;
  WASM2.prototype._wl_scene_environment_set_tint = requireRuntime1_2_3;
  WASM2.prototype._wl_scene_environment_get_tint = requireRuntime1_2_3;
  WASM2.prototype._wl_scene_environment_set_coefficients = requireRuntime1_2_3;
  WASM2.prototype._wl_scene_environment_get_coefficients = requireRuntime1_2_3;
  WASM2.prototype._wl_animation_component_get_iteration = requireRuntime1_2_3;
  WASM2.prototype._wl_animation_component_get_position = requireRuntime1_2_3;
  WASM2.prototype._wl_animation_component_get_duration = requireRuntime1_2_3;
  WASM2.prototype._wl_renderer_streaming_idle = requireRuntime1_2_3;

  // node_modules/@wonderlandengine/components/dist/8thwall-camera.js
  var ARCamera8thwall = class extends Component3 {
    /* 8thwall camera pipeline module name */
    name = "wonderland-engine-8thwall-camera";
    started = false;
    view = null;
    // cache camera
    position = [0, 0, 0];
    // cache 8thwall cam position
    rotation = [0, 0, 0, -1];
    // cache 8thwall cam rotation
    glTextureRenderer = null;
    // cache XR8.GlTextureRenderer.pipelineModule
    promptForDeviceMotion() {
      return new Promise(async (resolve, reject) => {
        window.dispatchEvent(new Event("8thwall-request-user-interaction"));
        window.addEventListener("8thwall-safe-to-request-permissions", async () => {
          try {
            const motionEvent = await DeviceMotionEvent.requestPermission();
            resolve(motionEvent);
          } catch (exception) {
            reject(exception);
          }
        });
      });
    }
    async getPermissions() {
      if (DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
        try {
          const result = await DeviceMotionEvent.requestPermission();
          if (result !== "granted") {
            throw new Error("MotionEvent");
          }
        } catch (exception) {
          if (exception.name === "NotAllowedError") {
            const motionEvent = await this.promptForDeviceMotion();
            if (motionEvent !== "granted") {
              throw new Error("MotionEvent");
            }
          } else {
            throw new Error("MotionEvent");
          }
        }
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (exception) {
        throw new Error("Camera");
      }
    }
    init() {
      this.view = this.object.getComponent("view");
      this.onUpdate = this.onUpdate.bind(this);
      this.onAttach = this.onAttach.bind(this);
      this.onException = this.onException.bind(this);
      this.onCameraStatusChange = this.onCameraStatusChange.bind(this);
    }
    async start() {
      this.view = this.object.getComponent("view");
      if (!this.useCustomUIOverlays) {
        OverlaysHandler.init();
      }
      try {
        await this.getPermissions();
      } catch (error) {
        window.dispatchEvent(new CustomEvent("8thwall-permission-fail", { detail: error }));
        return;
      }
      await this.waitForXR8();
      XR8.XrController.configure({
        disableWorldTracking: false
      });
      this.glTextureRenderer = XR8.GlTextureRenderer.pipelineModule();
      XR8.addCameraPipelineModules([
        this.glTextureRenderer,
        XR8.XrController.pipelineModule(),
        this
      ]);
      const config = {
        cameraConfig: {
          direction: XR8.XrConfig.camera().BACK
        },
        canvas: Module.canvas,
        allowedDevices: XR8.XrConfig.device().ANY,
        ownRunLoop: false
      };
      XR8.run(config);
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onAttach(params) {
      this.started = true;
      this.engine.scene.colorClearEnabled = false;
      const gl = Module.ctx;
      const rot = this.object.rotationWorld;
      const pos = this.object.getTranslationWorld([]);
      this.position = Array.from(pos);
      this.rotation = Array.from(rot);
      XR8.XrController.updateCameraProjectionMatrix({
        origin: { x: pos[0], y: pos[1], z: pos[2] },
        facing: { x: rot[0], y: rot[1], z: rot[2], w: rot[3] },
        cam: {
          pixelRectWidth: Module.canvas.width,
          pixelRectHeight: Module.canvas.height,
          nearClipPlane: this.view.near,
          farClipPlane: this.view.far
        }
      });
      this.engine.scene.onPreRender.push(() => {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        XR8.runPreRender(Date.now());
        XR8.runRender();
      });
      this.engine.scene.onPostRender.push(() => {
        XR8.runPostRender(Date.now());
      });
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onCameraStatusChange(e) {
      if (e && e.status === "failed") {
        this.onException(new Error(`Camera failed with status: ${e.status}`));
      }
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onUpdate(e) {
      if (!e.processCpuResult.reality)
        return;
      const { rotation, position, intrinsics } = e.processCpuResult.reality;
      this.rotation[0] = rotation.x;
      this.rotation[1] = rotation.y;
      this.rotation[2] = rotation.z;
      this.rotation[3] = rotation.w;
      this.position[0] = position.x;
      this.position[1] = position.y;
      this.position[2] = position.z;
      if (intrinsics) {
        const projectionMatrix = this.view.projectionMatrix;
        for (let i = 0; i < 16; i++) {
          if (Number.isFinite(intrinsics[i])) {
            projectionMatrix[i] = intrinsics[i];
          }
        }
      }
      if (position && rotation) {
        this.object.rotationWorld = this.rotation;
        this.object.setTranslationWorld(this.position);
      }
    }
    /**
     * @private
     * 8thwall pipeline function
     */
    onException(error) {
      console.error("8thwall exception:", error);
      window.dispatchEvent(new CustomEvent("8thwall-error", { detail: error }));
    }
    waitForXR8() {
      return new Promise((resolve, _rej) => {
        if (window.XR8) {
          resolve();
        } else {
          window.addEventListener("xrloaded", () => resolve());
        }
      });
    }
  };
  __publicField(ARCamera8thwall, "TypeName", "8thwall-camera");
  __publicField(ARCamera8thwall, "Properties", {
    /** Override the WL html overlays for handling camera/motion permissions and error handling */
    useCustomUIOverlays: { type: Type.Bool, default: false }
  });
  var OverlaysHandler = {
    init: function() {
      this.handleRequestUserInteraction = this.handleRequestUserInteraction.bind(this);
      this.handlePermissionFail = this.handlePermissionFail.bind(this);
      this.handleError = this.handleError.bind(this);
      window.addEventListener("8thwall-request-user-interaction", this.handleRequestUserInteraction);
      window.addEventListener("8thwall-permission-fail", this.handlePermissionFail);
      window.addEventListener("8thwall-error", this.handleError);
    },
    handleRequestUserInteraction: function() {
      const overlay = this.showOverlay(requestPermissionOverlay);
      window.addEventListener("8thwall-safe-to-request-permissions", () => {
        overlay.remove();
      });
    },
    handlePermissionFail: function(_reason) {
      this.showOverlay(failedPermissionOverlay);
    },
    handleError: function(_error) {
      this.showOverlay(runtimeErrorOverlay);
    },
    showOverlay: function(htmlContent) {
      const overlay = document.createElement("div");
      overlay.innerHTML = htmlContent;
      document.body.appendChild(overlay);
      return overlay;
    }
  };
  var requestPermissionOverlay = `
<style>
  #request-permission-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .request-permission-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .request-permission-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="request-permission-overlay">
  <div class="request-permission-overlay_title">This app requires to use your camera and motion sensors</div>

  <button class="request-permission-overlay_button" onclick="window.dispatchEvent(new Event('8thwall-safe-to-request-permissions'))">OK</button>
</div>`;
  var failedPermissionOverlay = `
<style>
  #failed-permission-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .failed-permission-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .failed-permission-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="failed-permission-overlay">
  <div class="failed-permission-overlay_title">Failed to grant permissions. Reset the the permissions and refresh the page.</div>

  <button class="failed-permission-overlay_button" onclick="window.location.reload()">Refresh the page</button>
</div>`;
  var runtimeErrorOverlay = `
<style>
  #wall-error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .wall-error-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .wall-error-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="wall-error-overlay">
  <div class="wall-error-overlay_title">Error has occurred. Please reload the page</div>

  <button class="wall-error-overlay_button" onclick="window.location.reload()">Reload</button>
</div>`;

  // node_modules/@wonderlandengine/components/dist/utils/webxr.js
  var tempVec = new Float32Array(3);
  var tempQuat = new Float32Array(4);
  function setXRRigidTransformLocal(o, transform) {
    const r = transform.orientation;
    tempQuat[0] = r.x;
    tempQuat[1] = r.y;
    tempQuat[2] = r.z;
    tempQuat[3] = r.w;
    const t = transform.position;
    tempVec[0] = t.x;
    tempVec[1] = t.y;
    tempVec[2] = t.z;
    o.resetPositionRotation();
    o.setRotationLocal(tempQuat);
    o.translateLocal(tempVec);
  }

  // node_modules/@wonderlandengine/components/dist/anchor.js
  var __decorate = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec3 = new Float32Array(3);
  var tempQuat2 = new Float32Array(4);
  var _anchors, _addAnchor, addAnchor_fn, _removeAnchor, removeAnchor_fn, _getFrame, getFrame_fn, _createAnchor, createAnchor_fn, _onAddAnchor, onAddAnchor_fn, _onRestoreAnchor, onRestoreAnchor_fn, _onCreate, onCreate_fn;
  var _Anchor = class extends Component3 {
    constructor() {
      super(...arguments);
      __privateAdd(this, _getFrame);
      __privateAdd(this, _createAnchor);
      __privateAdd(this, _onAddAnchor);
      __privateAdd(this, _onRestoreAnchor);
      __privateAdd(this, _onCreate);
      __publicField(this, "persist", false);
      /** Unique identifier to load a persistent anchor from, or empty/null if unknown */
      __publicField(this, "uuid", null);
      /** The xrAnchor, if created */
      __publicField(this, "xrAnchor", null);
      /** Emits events when the anchor is created either by being restored or newly created */
      __publicField(this, "onCreate", new Emitter());
      /** Whether the anchor is currently being tracked */
      __publicField(this, "visible", false);
      /** Emits an event when this anchor starts tracking */
      __publicField(this, "onTrackingFound", new Emitter());
      /** Emits an event when this anchor stops tracking */
      __publicField(this, "onTrackingLost", new Emitter());
      /** XRFrame to use for creating the anchor */
      __publicField(this, "xrFrame", null);
      /** XRHitTestResult to use for creating the anchor */
      __publicField(this, "xrHitResult", null);
    }
    /** Retrieve all anchors of the current scene */
    static getAllAnchors() {
      return __privateGet(_Anchor, _anchors);
    }
    /**
     * Create a new anchor
     *
     * @param o Object to attach the component to
     * @param params Parameters for the anchor component
     * @param frame XRFrame to use for anchor cration, if null, will use the current frame if available
     * @param hitResult Optional hit-test result to create the anchor with
     * @returns Promise for the newly created anchor component
     */
    static create(o, params, frame, hitResult) {
      const a = o.addComponent(_Anchor, { ...params, active: false });
      if (a === null)
        return null;
      a.xrHitResult = hitResult ?? null;
      a.xrFrame = frame ?? null;
      a.onCreate.once(() => (a.xrFrame = null, a.xrHitResult = null));
      a.active = true;
      return a.onCreate.promise();
    }
    start() {
      if (this.uuid && this.engine.xr) {
        this.persist = true;
        if (this.engine.xr.session.restorePersistentAnchor === void 0) {
          console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
        }
        this.engine.xr.session.restorePersistentAnchor(this.uuid).then(__privateMethod(this, _onRestoreAnchor, onRestoreAnchor_fn).bind(this));
      } else if (__privateMethod(this, _getFrame, getFrame_fn).call(this)) {
        __privateMethod(this, _createAnchor, createAnchor_fn).call(this).then(__privateMethod(this, _onAddAnchor, onAddAnchor_fn).bind(this));
      } else {
        throw new Error("Anchors can only be created during the XR frame in an active XR session");
      }
    }
    update() {
      if (!this.xrAnchor || !this.engine.xr)
        return;
      const pose = this.engine.xr.frame.getPose(this.xrAnchor.anchorSpace, this.engine.xr.currentReferenceSpace);
      const visible = !!pose;
      if (visible != this.visible) {
        this.visible = visible;
        (visible ? this.onTrackingFound : this.onTrackingLost).notify(this);
      }
      if (pose) {
        setXRRigidTransformLocal(this.object, pose.transform);
      }
    }
    onDestroy() {
      var _a12;
      __privateMethod(_a12 = _Anchor, _removeAnchor, removeAnchor_fn).call(_a12, this);
    }
  };
  var Anchor = _Anchor;
  _anchors = new WeakMap();
  _addAnchor = new WeakSet();
  addAnchor_fn = function(anchor) {
    __privateGet(_Anchor, _anchors).push(anchor);
  };
  _removeAnchor = new WeakSet();
  removeAnchor_fn = function(anchor) {
    const index = __privateGet(_Anchor, _anchors).indexOf(anchor);
    if (index < 0)
      return;
    __privateGet(_Anchor, _anchors).splice(index, 1);
  };
  _getFrame = new WeakSet();
  getFrame_fn = function() {
    return this.xrFrame || this.engine.xr.frame;
  };
  _createAnchor = new WeakSet();
  createAnchor_fn = async function() {
    if (!__privateMethod(this, _getFrame, getFrame_fn).call(this).createAnchor) {
      throw new Error("Cannot create anchor - anchors not supported, did you enable the 'anchors' WebXR feature?");
    }
    if (this.xrHitResult) {
      if (this.xrHitResult.createAnchor === void 0) {
        throw new Error("Requested anchor on XRHitTestResult, but WebXR hit-test feature is not available.");
      }
      return this.xrHitResult.createAnchor();
    } else {
      this.object.getTranslationWorld(tempVec3);
      tempQuat2.set(this.object.rotationWorld);
      const rotation = tempQuat2;
      const anchorPose = new XRRigidTransform({ x: tempVec3[0], y: tempVec3[1], z: tempVec3[2] }, { x: rotation[0], y: rotation[1], z: rotation[2], w: rotation[3] });
      return __privateMethod(this, _getFrame, getFrame_fn).call(this)?.createAnchor(anchorPose, this.engine.xr.currentReferenceSpace);
    }
  };
  _onAddAnchor = new WeakSet();
  onAddAnchor_fn = function(anchor) {
    if (!anchor)
      return;
    if (this.persist) {
      if (anchor.requestPersistentHandle !== void 0) {
        anchor.requestPersistentHandle().then((uuid) => {
          var _a12;
          this.uuid = uuid;
          __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
          __privateMethod(_a12 = _Anchor, _addAnchor, addAnchor_fn).call(_a12, this);
        });
        return;
      } else {
        console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
      }
    }
    __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
  };
  _onRestoreAnchor = new WeakSet();
  onRestoreAnchor_fn = function(anchor) {
    __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
  };
  _onCreate = new WeakSet();
  onCreate_fn = function(anchor) {
    this.xrAnchor = anchor;
    this.onCreate.notify(this);
  };
  __privateAdd(Anchor, _addAnchor);
  __privateAdd(Anchor, _removeAnchor);
  __publicField(Anchor, "TypeName", "anchor");
  /* Static management of all anchors */
  __privateAdd(Anchor, _anchors, []);
  __decorate([
    property.bool(false)
  ], Anchor.prototype, "persist", void 0);
  __decorate([
    property.string()
  ], Anchor.prototype, "uuid", void 0);

  // node_modules/@wonderlandengine/components/dist/cursor-target.js
  var CursorTarget = class extends Component3 {
    /** Emitter for events when the target is hovered */
    onHover = new Emitter();
    /** Emitter for events when the target is unhovered */
    onUnhover = new Emitter();
    /** Emitter for events when the target is clicked */
    onClick = new Emitter();
    /** Emitter for events when the cursor moves on the target */
    onMove = new Emitter();
    /** Emitter for events when the user pressed the select button on the target */
    onDown = new Emitter();
    /** Emitter for events when the user unpressed the select button on the target */
    onUp = new Emitter();
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onHover.add(f);
     */
    addHoverFunction(f2) {
      this.onHover.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onHover.remove(f);
     */
    removeHoverFunction(f2) {
      this.onHover.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onUnhover.add(f);
     */
    addUnHoverFunction(f2) {
      this.onUnhover.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onUnhover.remove(f);
     */
    removeUnHoverFunction(f2) {
      this.onUnhover.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    this.onClick.add(f);
     */
    addClickFunction(f2) {
      this.onClick.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onClick.remove(f);
     */
    removeClickFunction(f2) {
      this.onClick.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onMove.add(f);
     */
    addMoveFunction(f2) {
      this.onMove.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onMove.remove(f);
     */
    removeMoveFunction(f2) {
      this.onMove.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onDown.add(f);
     */
    addDownFunction(f2) {
      this.onDown.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onDown.remove(f);
     */
    removeDownFunction(f2) {
      this.onDown.remove(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onUp.add(f);
     */
    addUpFunction(f2) {
      this.onUp.add(f2);
    }
    /**
     * @deprecated Use the emitter instead.
     *
     * @example
     *    component.onUp.remove(f);
     */
    removeUpFunction(f2) {
      this.onUp.remove(f2);
    }
  };
  __publicField(CursorTarget, "TypeName", "cursor-target");
  __publicField(CursorTarget, "Properties", {});

  // node_modules/gl-matrix/esm/common.js
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var RANDOM = Math.random;
  var degree = Math.PI / 180;
  if (!Math.hypot)
    Math.hypot = function() {
      var y = 0, i = arguments.length;
      while (i--) {
        y += arguments[i] * arguments[i];
      }
      return Math.sqrt(y);
    };

  // node_modules/gl-matrix/esm/mat3.js
  function create() {
    var out = new ARRAY_TYPE(9);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }

  // node_modules/gl-matrix/esm/mat4.js
  var mat4_exports = {};
  __export(mat4_exports, {
    add: () => add,
    adjoint: () => adjoint,
    clone: () => clone,
    copy: () => copy,
    create: () => create2,
    determinant: () => determinant,
    equals: () => equals,
    exactEquals: () => exactEquals,
    frob: () => frob,
    fromQuat: () => fromQuat,
    fromQuat2: () => fromQuat2,
    fromRotation: () => fromRotation,
    fromRotationTranslation: () => fromRotationTranslation,
    fromRotationTranslationScale: () => fromRotationTranslationScale,
    fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
    fromScaling: () => fromScaling,
    fromTranslation: () => fromTranslation,
    fromValues: () => fromValues,
    fromXRotation: () => fromXRotation,
    fromYRotation: () => fromYRotation,
    fromZRotation: () => fromZRotation,
    frustum: () => frustum,
    getRotation: () => getRotation,
    getScaling: () => getScaling,
    getTranslation: () => getTranslation,
    identity: () => identity,
    invert: () => invert,
    lookAt: () => lookAt,
    mul: () => mul,
    multiply: () => multiply,
    multiplyScalar: () => multiplyScalar,
    multiplyScalarAndAdd: () => multiplyScalarAndAdd,
    ortho: () => ortho,
    orthoNO: () => orthoNO,
    orthoZO: () => orthoZO,
    perspective: () => perspective,
    perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
    perspectiveNO: () => perspectiveNO,
    perspectiveZO: () => perspectiveZO,
    rotate: () => rotate,
    rotateX: () => rotateX,
    rotateY: () => rotateY,
    rotateZ: () => rotateZ,
    scale: () => scale,
    set: () => set,
    str: () => str,
    sub: () => sub,
    subtract: () => subtract,
    targetTo: () => targetTo,
    translate: () => translate,
    transpose: () => transpose
  });
  function create2() {
    var out = new ARRAY_TYPE(16);
    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
    }
    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;
    return out;
  }
  function clone(a) {
    var out = new ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var out = new ARRAY_TYPE(16);
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  }
  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a) {
    if (out === a) {
      var a01 = a[1], a02 = a[2], a03 = a[3];
      var a12 = a[6], a13 = a[7];
      var a23 = a[11];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a01;
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a[0];
      out[1] = a[4];
      out[2] = a[8];
      out[3] = a[12];
      out[4] = a[1];
      out[5] = a[5];
      out[6] = a[9];
      out[7] = a[13];
      out[8] = a[2];
      out[9] = a[6];
      out[10] = a[10];
      out[11] = a[14];
      out[12] = a[3];
      out[13] = a[7];
      out[14] = a[11];
      out[15] = a[15];
    }
    return out;
  }
  function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
  function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }
  function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len4 = Math.hypot(x, y, z);
    var s, c, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len4 < EPSILON) {
      return null;
    }
    len4 = 1 / len4;
    x *= len4;
    y *= len4;
    z *= len4;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    return out;
  }
  function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }
  function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];
    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }
  function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }
  function fromTranslation(out, v) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromScaling(out, v) {
    out[0] = v[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = v[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = v[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotation(out, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len4 = Math.hypot(x, y, z);
    var s, c, t;
    if (len4 < EPSILON) {
      return null;
    }
    len4 = 1 / len4;
    x *= len4;
    y *= len4;
    z *= len4;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromXRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromYRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromZRotation(out, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function fromRotationTranslation(out, q2, v) {
    var x = q2[0], y = q2[1], z = q2[2], w = q2[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromQuat2(out, a) {
    var translation = new ARRAY_TYPE(3);
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
    var magnitude = bx * bx + by * by + bz * bz + bw * bw;
    if (magnitude > 0) {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
    } else {
      translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
      translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
      translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    }
    fromRotationTranslation(out, a, translation);
    return out;
  }
  function getTranslation(out, mat) {
    out[0] = mat[12];
    out[1] = mat[13];
    out[2] = mat[14];
    return out;
  }
  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.hypot(m11, m12, m13);
    out[1] = Math.hypot(m21, m22, m23);
    out[2] = Math.hypot(m31, m32, m33);
    return out;
  }
  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  function fromRotationTranslationScale(out, q2, v, s) {
    var x = q2[0], y = q2[1], z = q2[2], w = q2[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
  function fromRotationTranslationScaleOrigin(out, q2, v, s, o) {
    var x = q2[0], y = q2[1], z = q2[2], w = q2[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s[0];
    var sy = s[1];
    var sz = s[2];
    var ox = o[0];
    var oy = o[1];
    var oz = o[2];
    var out0 = (1 - (yy + zz)) * sx;
    var out1 = (xy + wz) * sx;
    var out2 = (xz - wy) * sx;
    var out4 = (xy - wz) * sy;
    var out5 = (1 - (xx + zz)) * sy;
    var out6 = (yz + wx) * sy;
    var out8 = (xz + wy) * sz;
    var out9 = (yz - wx) * sz;
    var out10 = (1 - (xx + yy)) * sz;
    out[0] = out0;
    out[1] = out1;
    out[2] = out2;
    out[3] = 0;
    out[4] = out4;
    out[5] = out5;
    out[6] = out6;
    out[7] = 0;
    out[8] = out8;
    out[9] = out9;
    out[10] = out10;
    out[11] = 0;
    out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
    out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
    out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
    out[15] = 1;
    return out;
  }
  function fromQuat(out, q2) {
    var x = q2[0], y = q2[1], z = q2[2], w = q2[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f2 = 1 / Math.tan(fovy / 2), nf;
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  var perspective = perspectiveNO;
  function perspectiveZO(out, fovy, aspect, near, far) {
    var f2 = 1 / Math.tan(fovy / 2), nf;
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = far * nf;
      out[14] = far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -near;
    }
    return out;
  }
  function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
    var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
    var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
    var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
    var xScale = 2 / (leftTan + rightTan);
    var yScale = 2 / (upTan + downTan);
    out[0] = xScale;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = yScale;
    out[6] = 0;
    out[7] = 0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = (upTan - downTan) * yScale * 0.5;
    out[10] = far / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near / (near - far);
    out[15] = 0;
    return out;
  }
  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  var ortho = orthoNO;
  function orthoZO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = near * nf;
    out[15] = 1;
    return out;
  }
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len4;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len4 = 1 / Math.hypot(z0, z1, z2);
    z0 *= len4;
    z1 *= len4;
    z2 *= len4;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len4 = Math.hypot(x0, x1, x2);
    if (!len4) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len4 = 1 / len4;
      x0 *= len4;
      x1 *= len4;
      x2 *= len4;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len4 = Math.hypot(y0, y1, y2);
    if (!len4) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len4 = 1 / len4;
      y0 *= len4;
      y1 *= len4;
      y2 *= len4;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }
  function targetTo(out, eye, target, up) {
    var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
    var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
    var len4 = z0 * z0 + z1 * z1 + z2 * z2;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
      z0 *= len4;
      z1 *= len4;
      z2 *= len4;
    }
    var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len4 = x0 * x0 + x1 * x1 + x2 * x2;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
      x0 *= len4;
      x1 *= len4;
      x2 *= len4;
    }
    out[0] = x0;
    out[1] = x1;
    out[2] = x2;
    out[3] = 0;
    out[4] = z1 * x2 - z2 * x1;
    out[5] = z2 * x0 - z0 * x2;
    out[6] = z0 * x1 - z1 * x0;
    out[7] = 0;
    out[8] = z0;
    out[9] = z1;
    out[10] = z2;
    out[11] = 0;
    out[12] = eyex;
    out[13] = eyey;
    out[14] = eyez;
    out[15] = 1;
    return out;
  }
  function str(a) {
    return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
  }
  function frob(a) {
    return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
  }
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  }
  function multiplyScalar(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    out[8] = a[8] * b;
    out[9] = a[9] * b;
    out[10] = a[10] * b;
    out[11] = a[11] * b;
    out[12] = a[12] * b;
    out[13] = a[13] * b;
    out[14] = a[14] * b;
    out[15] = a[15] * b;
    return out;
  }
  function multiplyScalarAndAdd(out, a, b, scale6) {
    out[0] = a[0] + b[0] * scale6;
    out[1] = a[1] + b[1] * scale6;
    out[2] = a[2] + b[2] * scale6;
    out[3] = a[3] + b[3] * scale6;
    out[4] = a[4] + b[4] * scale6;
    out[5] = a[5] + b[5] * scale6;
    out[6] = a[6] + b[6] * scale6;
    out[7] = a[7] + b[7] * scale6;
    out[8] = a[8] + b[8] * scale6;
    out[9] = a[9] + b[9] * scale6;
    out[10] = a[10] + b[10] * scale6;
    out[11] = a[11] + b[11] * scale6;
    out[12] = a[12] + b[12] * scale6;
    out[13] = a[13] + b[13] * scale6;
    out[14] = a[14] + b[14] * scale6;
    out[15] = a[15] + b[15] * scale6;
    return out;
  }
  function exactEquals(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  }
  function equals(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
    var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
    var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
  }
  var mul = multiply;
  var sub = subtract;

  // node_modules/gl-matrix/esm/quat.js
  var quat_exports = {};
  __export(quat_exports, {
    add: () => add4,
    calculateW: () => calculateW,
    clone: () => clone4,
    conjugate: () => conjugate,
    copy: () => copy4,
    create: () => create5,
    dot: () => dot3,
    equals: () => equals4,
    exactEquals: () => exactEquals4,
    exp: () => exp,
    fromEuler: () => fromEuler,
    fromMat3: () => fromMat3,
    fromValues: () => fromValues4,
    getAngle: () => getAngle,
    getAxisAngle: () => getAxisAngle,
    identity: () => identity2,
    invert: () => invert2,
    len: () => len2,
    length: () => length3,
    lerp: () => lerp3,
    ln: () => ln,
    mul: () => mul3,
    multiply: () => multiply3,
    normalize: () => normalize3,
    pow: () => pow,
    random: () => random2,
    rotateX: () => rotateX3,
    rotateY: () => rotateY3,
    rotateZ: () => rotateZ3,
    rotationTo: () => rotationTo,
    scale: () => scale4,
    set: () => set4,
    setAxes: () => setAxes,
    setAxisAngle: () => setAxisAngle,
    slerp: () => slerp,
    sqlerp: () => sqlerp,
    sqrLen: () => sqrLen2,
    squaredLength: () => squaredLength3,
    str: () => str3
  });

  // node_modules/gl-matrix/esm/vec3.js
  var vec3_exports = {};
  __export(vec3_exports, {
    add: () => add2,
    angle: () => angle,
    bezier: () => bezier,
    ceil: () => ceil,
    clone: () => clone2,
    copy: () => copy2,
    create: () => create3,
    cross: () => cross,
    dist: () => dist,
    distance: () => distance,
    div: () => div,
    divide: () => divide,
    dot: () => dot,
    equals: () => equals2,
    exactEquals: () => exactEquals2,
    floor: () => floor,
    forEach: () => forEach,
    fromValues: () => fromValues2,
    hermite: () => hermite,
    inverse: () => inverse,
    len: () => len,
    length: () => length,
    lerp: () => lerp,
    max: () => max,
    min: () => min,
    mul: () => mul2,
    multiply: () => multiply2,
    negate: () => negate,
    normalize: () => normalize,
    random: () => random,
    rotateX: () => rotateX2,
    rotateY: () => rotateY2,
    rotateZ: () => rotateZ2,
    round: () => round,
    scale: () => scale2,
    scaleAndAdd: () => scaleAndAdd,
    set: () => set2,
    sqrDist: () => sqrDist,
    sqrLen: () => sqrLen,
    squaredDistance: () => squaredDistance,
    squaredLength: () => squaredLength,
    str: () => str2,
    sub: () => sub2,
    subtract: () => subtract2,
    transformMat3: () => transformMat3,
    transformMat4: () => transformMat4,
    transformQuat: () => transformQuat,
    zero: () => zero
  });
  function create3() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function clone2(a) {
    var out = new ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  function fromValues2(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function copy2(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  }
  function set2(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  function add2(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  }
  function subtract2(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  }
  function multiply2(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  function divide(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  }
  function ceil(out, a) {
    out[0] = Math.ceil(a[0]);
    out[1] = Math.ceil(a[1]);
    out[2] = Math.ceil(a[2]);
    return out;
  }
  function floor(out, a) {
    out[0] = Math.floor(a[0]);
    out[1] = Math.floor(a[1]);
    out[2] = Math.floor(a[2]);
    return out;
  }
  function min(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  }
  function max(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  }
  function round(out, a) {
    out[0] = Math.round(a[0]);
    out[1] = Math.round(a[1]);
    out[2] = Math.round(a[2]);
    return out;
  }
  function scale2(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
  }
  function scaleAndAdd(out, a, b, scale6) {
    out[0] = a[0] + b[0] * scale6;
    out[1] = a[1] + b[1] * scale6;
    out[2] = a[2] + b[2] * scale6;
    return out;
  }
  function distance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return Math.hypot(x, y, z);
  }
  function squaredDistance(a, b) {
    var x = b[0] - a[0];
    var y = b[1] - a[1];
    var z = b[2] - a[2];
    return x * x + y * y + z * z;
  }
  function squaredLength(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return x * x + y * y + z * z;
  }
  function negate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  }
  function inverse(out, a) {
    out[0] = 1 / a[0];
    out[1] = 1 / a[1];
    out[2] = 1 / a[2];
    return out;
  }
  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len4 = x * x + y * y + z * z;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
    }
    out[0] = a[0] * len4;
    out[1] = a[1] * len4;
    out[2] = a[2] * len4;
    return out;
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
  }
  function hermite(out, a, b, c, d, t) {
    var factorTimes2 = t * t;
    var factor1 = factorTimes2 * (2 * t - 3) + 1;
    var factor2 = factorTimes2 * (t - 2) + t;
    var factor3 = factorTimes2 * (t - 1);
    var factor4 = factorTimes2 * (3 - 2 * t);
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function bezier(out, a, b, c, d, t) {
    var inverseFactor = 1 - t;
    var inverseFactorTimesTwo = inverseFactor * inverseFactor;
    var factorTimes2 = t * t;
    var factor1 = inverseFactorTimesTwo * inverseFactor;
    var factor2 = 3 * t * inverseFactorTimesTwo;
    var factor3 = 3 * factorTimes2 * inverseFactor;
    var factor4 = factorTimes2 * t;
    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
    return out;
  }
  function random(out, scale6) {
    scale6 = scale6 || 1;
    var r = RANDOM() * 2 * Math.PI;
    var z = RANDOM() * 2 - 1;
    var zScale = Math.sqrt(1 - z * z) * scale6;
    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale6;
    return out;
  }
  function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  function transformMat3(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  function transformQuat(out, a, q2) {
    var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3];
    var x = a[0], y = a[1], z = a[2];
    var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
    var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  function rotateX2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
    r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateY2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function rotateZ2(out, a, b, rad) {
    var p = [], r = [];
    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2];
    r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
    r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
    r[2] = p[2];
    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  function angle(a, b) {
    var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  function zero(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
  }
  function str2(a) {
    return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
  }
  function exactEquals2(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }
  function equals2(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2];
    var b0 = b[0], b1 = b[1], b2 = b[2];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
  }
  var sub2 = subtract2;
  var mul2 = multiply2;
  var div = divide;
  var dist = distance;
  var sqrDist = squaredDistance;
  var len = length;
  var sqrLen = squaredLength;
  var forEach = function() {
    var vec = create3();
    return function(a, stride, offset2, count, fn, arg) {
      var i, l2;
      if (!stride) {
        stride = 3;
      }
      if (!offset2) {
        offset2 = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset2, a.length);
      } else {
        l2 = a.length;
      }
      for (i = offset2; i < l2; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  }();

  // node_modules/gl-matrix/esm/vec4.js
  function create4() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  function clone3(a) {
    var out = new ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  function fromValues3(x, y, z, w) {
    var out = new ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  function copy3(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
  }
  function set3(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  function add3(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }
  function scale3(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  function length2(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return Math.hypot(x, y, z, w);
  }
  function squaredLength2(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return x * x + y * y + z * z + w * w;
  }
  function normalize2(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len4 = x * x + y * y + z * z + w * w;
    if (len4 > 0) {
      len4 = 1 / Math.sqrt(len4);
    }
    out[0] = x * len4;
    out[1] = y * len4;
    out[2] = z * len4;
    out[3] = w * len4;
    return out;
  }
  function dot2(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  function lerp2(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
  }
  function exactEquals3(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  function equals3(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
  }
  var forEach2 = function() {
    var vec = create4();
    return function(a, stride, offset2, count, fn, arg) {
      var i, l2;
      if (!stride) {
        stride = 4;
      }
      if (!offset2) {
        offset2 = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset2, a.length);
      } else {
        l2 = a.length;
      }
      for (i = offset2; i < l2; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }
      return a;
    };
  }();

  // node_modules/gl-matrix/esm/quat.js
  function create5() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    out[3] = 1;
    return out;
  }
  function identity2(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  function getAxisAngle(out_axis, q2) {
    var rad = Math.acos(q2[3]) * 2;
    var s = Math.sin(rad / 2);
    if (s > EPSILON) {
      out_axis[0] = q2[0] / s;
      out_axis[1] = q2[1] / s;
      out_axis[2] = q2[2] / s;
    } else {
      out_axis[0] = 1;
      out_axis[1] = 0;
      out_axis[2] = 0;
    }
    return rad;
  }
  function getAngle(a, b) {
    var dotproduct = dot3(a, b);
    return Math.acos(2 * dotproduct * dotproduct - 1);
  }
  function multiply3(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function rotateX3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  function rotateY3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var by = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  function rotateZ3(out, a, rad) {
    rad *= 0.5;
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bz = Math.sin(rad), bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  function calculateW(out, a) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
    return out;
  }
  function exp(out, a) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    var r = Math.sqrt(x * x + y * y + z * z);
    var et = Math.exp(w);
    var s = r > 0 ? et * Math.sin(r) / r : 0;
    out[0] = x * s;
    out[1] = y * s;
    out[2] = z * s;
    out[3] = et * Math.cos(r);
    return out;
  }
  function ln(out, a) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    var r = Math.sqrt(x * x + y * y + z * z);
    var t = r > 0 ? Math.atan2(r, w) / r : 0;
    out[0] = x * t;
    out[1] = y * t;
    out[2] = z * t;
    out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
    return out;
  }
  function pow(out, a, b) {
    ln(out, a);
    scale4(out, out, b);
    exp(out, out);
    return out;
  }
  function slerp(out, a, b, t) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3];
    var bx = b[0], by = b[1], bz = b[2], bw = b[3];
    var omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > EPSILON) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function random2(out) {
    var u1 = RANDOM();
    var u2 = RANDOM();
    var u3 = RANDOM();
    var sqrt1MinusU1 = Math.sqrt(1 - u1);
    var sqrtU1 = Math.sqrt(u1);
    out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
    out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
    out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
    out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
    return out;
  }
  function invert2(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var dot5 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    var invDot = dot5 ? 1 / dot5 : 0;
    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
  }
  function fromMat3(out, m) {
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;
    if (fTrace > 0) {
      fRoot = Math.sqrt(fTrace + 1);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      var i = 0;
      if (m[4] > m[0])
        i = 1;
      if (m[8] > m[i * 3 + i])
        i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }
  function fromEuler(out, x, y, z) {
    var halfToRad = 0.5 * Math.PI / 180;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    var sx = Math.sin(x);
    var cx = Math.cos(x);
    var sy = Math.sin(y);
    var cy = Math.cos(y);
    var sz = Math.sin(z);
    var cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }
  function str3(a) {
    return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
  }
  var clone4 = clone3;
  var fromValues4 = fromValues3;
  var copy4 = copy3;
  var set4 = set3;
  var add4 = add3;
  var mul3 = multiply3;
  var scale4 = scale3;
  var dot3 = dot2;
  var lerp3 = lerp2;
  var length3 = length2;
  var len2 = length3;
  var squaredLength3 = squaredLength2;
  var sqrLen2 = squaredLength3;
  var normalize3 = normalize2;
  var exactEquals4 = exactEquals3;
  var equals4 = equals3;
  var rotationTo = function() {
    var tmpvec3 = create3();
    var xUnitVec3 = fromValues2(1, 0, 0);
    var yUnitVec3 = fromValues2(0, 1, 0);
    return function(out, a, b) {
      var dot5 = dot(a, b);
      if (dot5 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 1e-6)
          cross(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot5 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot5;
        return normalize3(out, out);
      }
    };
  }();
  var sqlerp = function() {
    var temp1 = create5();
    var temp2 = create5();
    return function(out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  }();
  var setAxes = function() {
    var matr = create();
    return function(out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize3(out, fromMat3(out, matr));
    };
  }();

  // node_modules/gl-matrix/esm/quat2.js
  var quat2_exports = {};
  __export(quat2_exports, {
    add: () => add5,
    clone: () => clone5,
    conjugate: () => conjugate2,
    copy: () => copy5,
    create: () => create6,
    dot: () => dot4,
    equals: () => equals5,
    exactEquals: () => exactEquals5,
    fromMat4: () => fromMat4,
    fromRotation: () => fromRotation2,
    fromRotationTranslation: () => fromRotationTranslation2,
    fromRotationTranslationValues: () => fromRotationTranslationValues,
    fromTranslation: () => fromTranslation2,
    fromValues: () => fromValues5,
    getDual: () => getDual,
    getReal: () => getReal,
    getTranslation: () => getTranslation2,
    identity: () => identity3,
    invert: () => invert3,
    len: () => len3,
    length: () => length4,
    lerp: () => lerp4,
    mul: () => mul4,
    multiply: () => multiply4,
    normalize: () => normalize4,
    rotateAroundAxis: () => rotateAroundAxis,
    rotateByQuatAppend: () => rotateByQuatAppend,
    rotateByQuatPrepend: () => rotateByQuatPrepend,
    rotateX: () => rotateX4,
    rotateY: () => rotateY4,
    rotateZ: () => rotateZ4,
    scale: () => scale5,
    set: () => set5,
    setDual: () => setDual,
    setReal: () => setReal,
    sqrLen: () => sqrLen3,
    squaredLength: () => squaredLength4,
    str: () => str4,
    translate: () => translate2
  });
  function create6() {
    var dq = new ARRAY_TYPE(8);
    if (ARRAY_TYPE != Float32Array) {
      dq[0] = 0;
      dq[1] = 0;
      dq[2] = 0;
      dq[4] = 0;
      dq[5] = 0;
      dq[6] = 0;
      dq[7] = 0;
    }
    dq[3] = 1;
    return dq;
  }
  function clone5(a) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = a[0];
    dq[1] = a[1];
    dq[2] = a[2];
    dq[3] = a[3];
    dq[4] = a[4];
    dq[5] = a[5];
    dq[6] = a[6];
    dq[7] = a[7];
    return dq;
  }
  function fromValues5(x1, y1, z1, w1, x2, y2, z2, w2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    dq[4] = x2;
    dq[5] = y2;
    dq[6] = z2;
    dq[7] = w2;
    return dq;
  }
  function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
    var dq = new ARRAY_TYPE(8);
    dq[0] = x1;
    dq[1] = y1;
    dq[2] = z1;
    dq[3] = w1;
    var ax = x2 * 0.5, ay = y2 * 0.5, az = z2 * 0.5;
    dq[4] = ax * w1 + ay * z1 - az * y1;
    dq[5] = ay * w1 + az * x1 - ax * z1;
    dq[6] = az * w1 + ax * y1 - ay * x1;
    dq[7] = -ax * x1 - ay * y1 - az * z1;
    return dq;
  }
  function fromRotationTranslation2(out, q2, t) {
    var ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q2[0], by = q2[1], bz = q2[2], bw = q2[3];
    out[0] = bx;
    out[1] = by;
    out[2] = bz;
    out[3] = bw;
    out[4] = ax * bw + ay * bz - az * by;
    out[5] = ay * bw + az * bx - ax * bz;
    out[6] = az * bw + ax * by - ay * bx;
    out[7] = -ax * bx - ay * by - az * bz;
    return out;
  }
  function fromTranslation2(out, t) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = t[0] * 0.5;
    out[5] = t[1] * 0.5;
    out[6] = t[2] * 0.5;
    out[7] = 0;
    return out;
  }
  function fromRotation2(out, q2) {
    out[0] = q2[0];
    out[1] = q2[1];
    out[2] = q2[2];
    out[3] = q2[3];
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  function fromMat4(out, a) {
    var outer = create5();
    getRotation(outer, a);
    var t = new ARRAY_TYPE(3);
    getTranslation(t, a);
    fromRotationTranslation2(out, outer, t);
    return out;
  }
  function copy5(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    return out;
  }
  function identity3(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    return out;
  }
  function set5(out, x1, y1, z1, w1, x2, y2, z2, w2) {
    out[0] = x1;
    out[1] = y1;
    out[2] = z1;
    out[3] = w1;
    out[4] = x2;
    out[5] = y2;
    out[6] = z2;
    out[7] = w2;
    return out;
  }
  var getReal = copy4;
  function getDual(out, a) {
    out[0] = a[4];
    out[1] = a[5];
    out[2] = a[6];
    out[3] = a[7];
    return out;
  }
  var setReal = copy4;
  function setDual(out, q2) {
    out[4] = q2[0];
    out[5] = q2[1];
    out[6] = q2[2];
    out[7] = q2[3];
    return out;
  }
  function getTranslation2(out, a) {
    var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
    out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
    return out;
  }
  function translate2(out, a, v) {
    var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
    out[0] = ax1;
    out[1] = ay1;
    out[2] = az1;
    out[3] = aw1;
    out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
    out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
    out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
    out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
    return out;
  }
  function rotateX4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateX3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateY4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateY3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateZ4(out, a, rad) {
    var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
    rotateZ3(out, a, rad);
    bx = out[0];
    by = out[1];
    bz = out[2];
    bw = out[3];
    out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    return out;
  }
  function rotateByQuatAppend(out, a, q2) {
    var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
    out[0] = ax * qw + aw * qx + ay * qz - az * qy;
    out[1] = ay * qw + aw * qy + az * qx - ax * qz;
    out[2] = az * qw + aw * qz + ax * qy - ay * qx;
    out[3] = aw * qw - ax * qx - ay * qy - az * qz;
    ax = a[4];
    ay = a[5];
    az = a[6];
    aw = a[7];
    out[4] = ax * qw + aw * qx + ay * qz - az * qy;
    out[5] = ay * qw + aw * qy + az * qx - ax * qz;
    out[6] = az * qw + aw * qz + ax * qy - ay * qx;
    out[7] = aw * qw - ax * qx - ay * qy - az * qz;
    return out;
  }
  function rotateByQuatPrepend(out, q2, a) {
    var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
    out[0] = qx * bw + qw * bx + qy * bz - qz * by;
    out[1] = qy * bw + qw * by + qz * bx - qx * bz;
    out[2] = qz * bw + qw * bz + qx * by - qy * bx;
    out[3] = qw * bw - qx * bx - qy * by - qz * bz;
    bx = a[4];
    by = a[5];
    bz = a[6];
    bw = a[7];
    out[4] = qx * bw + qw * bx + qy * bz - qz * by;
    out[5] = qy * bw + qw * by + qz * bx - qx * bz;
    out[6] = qz * bw + qw * bz + qx * by - qy * bx;
    out[7] = qw * bw - qx * bx - qy * by - qz * bz;
    return out;
  }
  function rotateAroundAxis(out, a, axis, rad) {
    if (Math.abs(rad) < EPSILON) {
      return copy5(out, a);
    }
    var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
    rad = rad * 0.5;
    var s = Math.sin(rad);
    var bx = s * axis[0] / axisLength;
    var by = s * axis[1] / axisLength;
    var bz = s * axis[2] / axisLength;
    var bw = Math.cos(rad);
    var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
    out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
    out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
    out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
    out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
    var ax = a[4], ay = a[5], az = a[6], aw = a[7];
    out[4] = ax * bw + aw * bx + ay * bz - az * by;
    out[5] = ay * bw + aw * by + az * bx - ax * bz;
    out[6] = az * bw + aw * bz + ax * by - ay * bx;
    out[7] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  function add5(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    return out;
  }
  function multiply4(out, a, b) {
    var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3];
    out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
    out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
    out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
    out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
    out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
    out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
    out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
    out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
    return out;
  }
  var mul4 = multiply4;
  function scale5(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    out[4] = a[4] * b;
    out[5] = a[5] * b;
    out[6] = a[6] * b;
    out[7] = a[7] * b;
    return out;
  }
  var dot4 = dot3;
  function lerp4(out, a, b, t) {
    var mt2 = 1 - t;
    if (dot4(a, b) < 0)
      t = -t;
    out[0] = a[0] * mt2 + b[0] * t;
    out[1] = a[1] * mt2 + b[1] * t;
    out[2] = a[2] * mt2 + b[2] * t;
    out[3] = a[3] * mt2 + b[3] * t;
    out[4] = a[4] * mt2 + b[4] * t;
    out[5] = a[5] * mt2 + b[5] * t;
    out[6] = a[6] * mt2 + b[6] * t;
    out[7] = a[7] * mt2 + b[7] * t;
    return out;
  }
  function invert3(out, a) {
    var sqlen = squaredLength4(a);
    out[0] = -a[0] / sqlen;
    out[1] = -a[1] / sqlen;
    out[2] = -a[2] / sqlen;
    out[3] = a[3] / sqlen;
    out[4] = -a[4] / sqlen;
    out[5] = -a[5] / sqlen;
    out[6] = -a[6] / sqlen;
    out[7] = a[7] / sqlen;
    return out;
  }
  function conjugate2(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    out[4] = -a[4];
    out[5] = -a[5];
    out[6] = -a[6];
    out[7] = a[7];
    return out;
  }
  var length4 = length3;
  var len3 = length4;
  var squaredLength4 = squaredLength3;
  var sqrLen3 = squaredLength4;
  function normalize4(out, a) {
    var magnitude = squaredLength4(a);
    if (magnitude > 0) {
      magnitude = Math.sqrt(magnitude);
      var a0 = a[0] / magnitude;
      var a1 = a[1] / magnitude;
      var a2 = a[2] / magnitude;
      var a3 = a[3] / magnitude;
      var b0 = a[4];
      var b1 = a[5];
      var b2 = a[6];
      var b3 = a[7];
      var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
      out[0] = a0;
      out[1] = a1;
      out[2] = a2;
      out[3] = a3;
      out[4] = (b0 - a0 * a_dot_b) / magnitude;
      out[5] = (b1 - a1 * a_dot_b) / magnitude;
      out[6] = (b2 - a2 * a_dot_b) / magnitude;
      out[7] = (b3 - a3 * a_dot_b) / magnitude;
    }
    return out;
  }
  function str4(a) {
    return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
  }
  function exactEquals5(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
  }
  function equals5(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
    return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
  }

  // node_modules/@wonderlandengine/components/dist/hit-test-location.js
  var __decorate2 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var HitTestLocation = class extends Component3 {
    tempScaling = new Float32Array(3);
    visible = false;
    xrHitTestSource = null;
    /** Reference space for creating the hit test when the session starts */
    xrReferenceSpace = null;
    /**
     * For maintaining backwards compatibility: Whether to scale the object to 0 and back.
     * @deprecated Use onHitLost and onHitFound instead.
     */
    scaleObject = true;
    /** Emits an event when the hit test switches from visible to invisible */
    onHitLost = new Emitter();
    /** Emits an event when the hit test switches from invisible to visible */
    onHitFound = new Emitter();
    onSessionStartCallback = null;
    onSessionEndCallback = null;
    start() {
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
      if (this.scaleObject) {
        this.tempScaling.set(this.object.scalingLocal);
        this.object.scale([0, 0, 0]);
        this.onHitLost.add(() => {
          this.tempScaling.set(this.object.scalingLocal);
          this.object.scale([0, 0, 0]);
        });
        this.onHitFound.add(() => {
          this.object.scalingLocal.set(this.tempScaling);
          this.object.setDirty();
        });
      }
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    update() {
      const wasVisible = this.visible;
      if (this.xrHitTestSource) {
        const frame = this.engine.xrFrame;
        if (!frame)
          return;
        let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
        if (hitTestResults.length > 0) {
          let pose = hitTestResults[0].getPose(this.engine.xr.currentReferenceSpace);
          this.visible = !!pose;
          if (pose) {
            setXRRigidTransformLocal(this.object, pose.transform);
          }
        } else {
          this.visible = false;
        }
      }
      if (this.visible != wasVisible) {
        (this.visible ? this.onHitFound : this.onHitLost).notify(this);
      }
    }
    getHitTestResults(frame = this.engine.xr?.frame ?? null) {
      if (!frame)
        return [];
      if (!this.xrHitTestSource)
        return [];
      return frame.getHitTestResults(this.xrHitTestSource);
    }
    onXRSessionStart(session) {
      if (session.requestHitTestSource === void 0) {
        console.error("hit-test-location: hit test feature not available. Deactivating component.");
        this.active = false;
        return;
      }
      session.requestHitTestSource({
        space: this.xrReferenceSpace ?? this.engine.xr.referenceSpaceForType("viewer")
      }).then((hitTestSource) => {
        this.xrHitTestSource = hitTestSource;
      }).catch(console.error);
    }
    onXRSessionEnd() {
      if (!this.xrHitTestSource)
        return;
      this.xrHitTestSource.cancel();
      this.xrHitTestSource = null;
    }
  };
  __publicField(HitTestLocation, "TypeName", "hit-test-location");
  __decorate2([
    property.bool(true)
  ], HitTestLocation.prototype, "scaleObject", void 0);

  // node_modules/@wonderlandengine/components/dist/cursor.js
  var __decorate3 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec2 = new Float32Array(3);
  var ZERO = [0, 0, 0];
  var CursorTargetEmitters = class {
    /** Emitter for events when the target is hovered */
    onHover = new Emitter();
    /** Emitter for events when the target is unhovered */
    onUnhover = new Emitter();
    /** Emitter for events when the target is clicked */
    onClick = new Emitter();
    /** Emitter for events when the cursor moves on the target */
    onMove = new Emitter();
    /** Emitter for events when the user pressed the select button on the target */
    onDown = new Emitter();
    /** Emitter for events when the user unpressed the select button on the target */
    onUp = new Emitter();
  };
  var Cursor = class extends Component3 {
    static onRegister(engine) {
      engine.registerComponent(HitTestLocation);
    }
    _collisionMask = 0;
    _onDeactivateCallbacks = [];
    _input = null;
    _origin = new Float32Array(3);
    _cursorObjScale = new Float32Array(3);
    _direction = new Float32Array(3);
    _projectionMatrix = new Float32Array(16);
    _viewComponent = null;
    _isDown = false;
    _lastIsDown = false;
    _arTouchDown = false;
    _lastPointerPos = new Float32Array(2);
    _lastCursorPosOnTarget = new Float32Array(3);
    _hitTestLocation = null;
    _hitTestObject = null;
    _onSessionStartCallback = null;
    /**
     * Whether the cursor (and cursorObject) is visible, i.e. pointing at an object
     * that matches the collision group
     */
    visible = true;
    /** Currently hovered object */
    hoveringObject = null;
    /** CursorTarget component of the currently hovered object */
    hoveringObjectTarget = null;
    /** Whether the cursor is hovering reality via hit-test */
    hoveringReality = false;
    /**
     * Global target lets you receive global cursor events on any object.
     */
    globalTarget = new CursorTargetEmitters();
    /**
     * Hit test target lets you receive cursor events for "reality", if
     * `useWebXRHitTest` is set to `true`.
     *
     * @example
     * ```js
     * cursor.hitTestTarget.onClick.add((hit, cursor) => {
     *     // User clicked on reality
     * });
     * ```
     */
    hitTestTarget = new CursorTargetEmitters();
    /** World position of the cursor */
    cursorPos = new Float32Array(3);
    /** Collision group for the ray cast. Only objects in this group will be affected by this cursor. */
    collisionGroup = 1;
    /** (optional) Object that visualizes the cursor's ray. */
    cursorRayObject = null;
    /** Axis along which to scale the `cursorRayObject`. */
    cursorRayScalingAxis = 2;
    /** (optional) Object that visualizes the cursor's hit location. */
    cursorObject = null;
    /** Handedness for VR cursors to accept trigger events only from respective controller. */
    handedness = 0;
    /** Mode for raycasting, whether to use PhysX or simple collision components */
    rayCastMode = 0;
    /** Maximum distance for the cursor's ray cast. */
    maxDistance = 100;
    /** Whether to set the CSS style of the mouse cursor on desktop */
    styleCursor = true;
    /**
     * Use WebXR hit-test if available.
     *
     * Attaches a hit-test-location component to the cursorObject, which will be used
     * by the cursor to send events to the hitTestTarget with HitTestResult.
     */
    useWebXRHitTest = false;
    _onViewportResize = () => {
      if (!this._viewComponent)
        return;
      mat4_exports.invert(this._projectionMatrix, this._viewComponent.projectionMatrix);
    };
    start() {
      this._collisionMask = 1 << this.collisionGroup;
      if (this.handedness == 0) {
        const inputComp = this.object.getComponent("input");
        if (!inputComp) {
          console.warn("cursor component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
        } else {
          this.handedness = inputComp.handedness || "none";
          this._input = inputComp;
        }
      } else {
        this.handedness = ["left", "right", "none"][this.handedness - 1];
      }
      this._viewComponent = this.object.getComponent(ViewComponent);
      if (this.useWebXRHitTest) {
        this._hitTestObject = this.engine.scene.addObject(this.object);
        this._hitTestLocation = this._hitTestObject.addComponent(HitTestLocation, {
          scaleObject: false
        }) ?? null;
      }
      this._onSessionStartCallback = this.setupVREvents.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this._onSessionStartCallback);
      this.engine.onResize.add(this._onViewportResize);
      this._setCursorVisibility(true);
      if (this._viewComponent != null) {
        const canvas2 = this.engine.canvas;
        const onClick = this.onClick.bind(this);
        const onPointerMove = this.onPointerMove.bind(this);
        const onPointerDown = this.onPointerDown.bind(this);
        const onPointerUp = this.onPointerUp.bind(this);
        canvas2.addEventListener("click", onClick);
        canvas2.addEventListener("pointermove", onPointerMove);
        canvas2.addEventListener("pointerdown", onPointerDown);
        canvas2.addEventListener("pointerup", onPointerUp);
        this._onDeactivateCallbacks.push(() => {
          canvas2.removeEventListener("click", onClick);
          canvas2.removeEventListener("pointermove", onPointerMove);
          canvas2.removeEventListener("pointerdown", onPointerDown);
          canvas2.removeEventListener("pointerup", onPointerUp);
        });
      }
      this._onViewportResize();
    }
    _setCursorRayTransform(hitPosition) {
      if (!this.cursorRayObject)
        return;
      const dist2 = vec3_exports.dist(this._origin, hitPosition);
      this.cursorRayObject.setPositionLocal([0, 0, -dist2 / 2]);
      if (this.cursorRayScalingAxis != 4) {
        tempVec2.fill(1);
        tempVec2[this.cursorRayScalingAxis] = dist2 / 2;
        this.cursorRayObject.setScalingLocal(tempVec2);
      }
    }
    _setCursorVisibility(visible) {
      if (this.visible == visible)
        return;
      this.visible = visible;
      if (!this.cursorObject)
        return;
      if (visible) {
        this.cursorObject.setScalingWorld(this._cursorObjScale);
      } else {
        this.cursorObject.getScalingWorld(this._cursorObjScale);
        this.cursorObject.scaleLocal([0, 0, 0]);
      }
    }
    update() {
      if (this.engine.xr && this._arTouchDown && this._input && this.engine.xr.session.inputSources[0].handedness === "none" && this.engine.xr.session.inputSources[0].gamepad) {
        const p = this.engine.xr.session.inputSources[0].gamepad.axes;
        this._direction[0] = p[0];
        this._direction[1] = -p[1];
        this._direction[2] = -1;
        this.applyTransformAndProjectDirection();
      } else if (this.engine.xr && this._input && this._input.xrInputSource) {
        this._direction[0] = 0;
        this._direction[1] = 0;
        this._direction[2] = -1;
        this.applyTransformToDirection();
      } else if (this._viewComponent) {
        this.updateDirection();
      }
      this.rayCast(null, this.engine.xr?.frame);
      if (this.cursorObject) {
        if (this.hoveringObject && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
          this._setCursorVisibility(true);
          this.cursorObject.setPositionWorld(this.cursorPos);
          this._setCursorRayTransform(this.cursorPos);
        } else {
          this._setCursorVisibility(false);
        }
      }
    }
    /* Returns the hovered cursor target, if available */
    notify(event, originalEvent) {
      const target = this.hoveringObject;
      if (target) {
        const cursorTarget = this.hoveringObjectTarget;
        if (cursorTarget)
          cursorTarget[event].notify(target, this, originalEvent ?? void 0);
        this.globalTarget[event].notify(target, this, originalEvent ?? void 0);
      }
    }
    hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent) {
      const hit = !this.hoveringReality && rayHit.hitCount > 0 ? rayHit.objects[0] : null;
      if (hit) {
        if (!this.hoveringObject || !this.hoveringObject.equals(hit)) {
          if (this.hoveringObject) {
            this.notify("onUnhover", originalEvent);
          }
          this.hoveringObject = hit;
          this.hoveringObjectTarget = this.hoveringObject.getComponent(CursorTarget);
          if (this.styleCursor)
            this.engine.canvas.style.cursor = "pointer";
          this.notify("onHover", originalEvent);
        }
      } else if (this.hoveringObject) {
        this.notify("onUnhover", originalEvent);
        this.hoveringObject = null;
        this.hoveringObjectTarget = null;
        if (this.styleCursor)
          this.engine.canvas.style.cursor = "default";
      }
      if (this.hoveringObject) {
        if (this._isDown !== this._lastIsDown) {
          this.notify(this._isDown ? "onDown" : "onUp", originalEvent);
        }
        if (doClick)
          this.notify("onClick", originalEvent);
      } else if (this.hoveringReality) {
        if (this._isDown !== this._lastIsDown) {
          (this._isDown ? this.hitTestTarget.onDown : this.hitTestTarget.onUp).notify(hitTestResult, this, originalEvent ?? void 0);
        }
        if (doClick)
          this.hitTestTarget.onClick.notify(hitTestResult, this, originalEvent ?? void 0);
      }
      if (hit) {
        if (this.hoveringObject) {
          this.hoveringObject.transformPointInverseWorld(tempVec2, this.cursorPos);
        } else {
          tempVec2.set(this.cursorPos);
        }
        if (!vec3_exports.equals(this._lastCursorPosOnTarget, tempVec2)) {
          this.notify("onMove", originalEvent);
          this._lastCursorPosOnTarget.set(tempVec2);
        }
      } else if (this.hoveringReality) {
        if (!vec3_exports.equals(this._lastCursorPosOnTarget, this.cursorPos)) {
          this.hitTestTarget.onMove.notify(hitTestResult, this, originalEvent ?? void 0);
          this._lastCursorPosOnTarget.set(this.cursorPos);
        }
      } else {
        this._lastCursorPosOnTarget.set(this.cursorPos);
      }
      this._lastIsDown = this._isDown;
    }
    /**
     * Setup event listeners on session object
     * @param s WebXR session
     *
     * Sets up 'select' and 'end' events.
     */
    setupVREvents(s) {
      if (!s)
        console.error("setupVREvents called without a valid session");
      if (!this.active)
        return;
      const onSelect = this.onSelect.bind(this);
      s.addEventListener("select", onSelect);
      const onSelectStart = this.onSelectStart.bind(this);
      s.addEventListener("selectstart", onSelectStart);
      const onSelectEnd = this.onSelectEnd.bind(this);
      s.addEventListener("selectend", onSelectEnd);
      this._onDeactivateCallbacks.push(() => {
        if (!this.engine.xr)
          return;
        s.removeEventListener("select", onSelect);
        s.removeEventListener("selectstart", onSelectStart);
        s.removeEventListener("selectend", onSelectEnd);
      });
      this._onViewportResize();
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this._onSessionStartCallback);
      this.engine.onResize.remove(this._onViewportResize);
      this._setCursorVisibility(false);
      if (this.hoveringObject)
        this.notify("onUnhover", null);
      if (this.cursorRayObject)
        this.cursorRayObject.setScalingLocal(ZERO);
      for (const f2 of this._onDeactivateCallbacks)
        f2();
      this._onDeactivateCallbacks.length = 0;
    }
    onDestroy() {
      this._hitTestObject?.destroy();
    }
    /** 'select' event listener */
    onSelect(e) {
      if (e.inputSource.handedness != this.handedness)
        return;
      this.rayCast(e, e.frame, true);
    }
    /** 'selectstart' event listener */
    onSelectStart(e) {
      this._arTouchDown = true;
      if (e.inputSource.handedness == this.handedness) {
        this._isDown = true;
        this.rayCast(e, e.frame);
      }
    }
    /** 'selectend' event listener */
    onSelectEnd(e) {
      this._arTouchDown = false;
      if (e.inputSource.handedness == this.handedness) {
        this._isDown = false;
        this.rayCast(e, e.frame);
      }
    }
    /** 'pointermove' event listener */
    onPointerMove(e) {
      if (!e.isPrimary)
        return;
      this.updateMousePos(e);
      this.rayCast(e, null);
    }
    /** 'click' event listener */
    onClick(e) {
      this.updateMousePos(e);
      this.rayCast(e, null, true);
    }
    /** 'pointerdown' event listener */
    onPointerDown(e) {
      if (!e.isPrimary || e.button !== 0)
        return;
      this.updateMousePos(e);
      this._isDown = true;
      this.rayCast(e);
    }
    /** 'pointerup' event listener */
    onPointerUp(e) {
      if (!e.isPrimary || e.button !== 0)
        return;
      this.updateMousePos(e);
      this._isDown = false;
      this.rayCast(e);
    }
    /**
     * Update mouse position in non-VR mode and raycast for new position
     * @returns @ref WL.RayHit for new position.
     */
    updateMousePos(e) {
      this._lastPointerPos[0] = e.clientX;
      this._lastPointerPos[1] = e.clientY;
      this.updateDirection();
    }
    updateDirection() {
      const bounds = this.engine.canvas.getBoundingClientRect();
      const left = this._lastPointerPos[0] / bounds.width;
      const top = this._lastPointerPos[1] / bounds.height;
      this._direction[0] = left * 2 - 1;
      this._direction[1] = -top * 2 + 1;
      this._direction[2] = -1;
      this.applyTransformAndProjectDirection();
    }
    applyTransformAndProjectDirection() {
      vec3_exports.transformMat4(this._direction, this._direction, this._projectionMatrix);
      vec3_exports.normalize(this._direction, this._direction);
      this.applyTransformToDirection();
    }
    applyTransformToDirection() {
      this.object.transformVectorWorld(this._direction, this._direction);
      this.object.getPositionWorld(this._origin);
    }
    rayCast(originalEvent, frame = null, doClick = false) {
      const rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(this._origin, this._direction, this._collisionMask) : this.engine.physics.rayCast(this._origin, this._direction, this._collisionMask, this.maxDistance);
      let hitResultDistance = Infinity;
      let hitTestResult = null;
      if (this._hitTestLocation?.visible) {
        this._hitTestObject.getPositionWorld(this.cursorPos);
        hitResultDistance = vec3_exports.distance(this.object.getPositionWorld(tempVec2), this.cursorPos);
        hitTestResult = this._hitTestLocation?.getHitTestResults(frame)[0];
      }
      let hoveringReality = false;
      if (rayHit.hitCount > 0) {
        const d = rayHit.distances[0];
        if (hitResultDistance >= d) {
          this.cursorPos.set(rayHit.locations[0]);
        } else {
          hoveringReality = true;
        }
      } else if (hitResultDistance < Infinity) {
      } else {
        this.cursorPos.fill(0);
      }
      if (hoveringReality && !this.hoveringReality) {
        this.hitTestTarget.onHover.notify(hitTestResult, this);
      } else if (!hoveringReality && this.hoveringReality) {
        this.hitTestTarget.onUnhover.notify(hitTestResult, this);
      }
      this.hoveringReality = hoveringReality;
      this.hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent);
      return rayHit;
    }
  };
  __publicField(Cursor, "TypeName", "cursor");
  /* Dependencies is deprecated, but we keep it here for compatibility
   * with 1.0.0-rc2 until 1.0.0 is released */
  __publicField(Cursor, "Dependencies", [HitTestLocation]);
  __decorate3([
    property.int(1)
  ], Cursor.prototype, "collisionGroup", void 0);
  __decorate3([
    property.object()
  ], Cursor.prototype, "cursorRayObject", void 0);
  __decorate3([
    property.enum(["x", "y", "z", "none"], "z")
  ], Cursor.prototype, "cursorRayScalingAxis", void 0);
  __decorate3([
    property.object()
  ], Cursor.prototype, "cursorObject", void 0);
  __decorate3([
    property.enum(["input component", "left", "right", "none"], "input component")
  ], Cursor.prototype, "handedness", void 0);
  __decorate3([
    property.enum(["collision", "physx"], "collision")
  ], Cursor.prototype, "rayCastMode", void 0);
  __decorate3([
    property.float(100)
  ], Cursor.prototype, "maxDistance", void 0);
  __decorate3([
    property.bool(true)
  ], Cursor.prototype, "styleCursor", void 0);
  __decorate3([
    property.bool(false)
  ], Cursor.prototype, "useWebXRHitTest", void 0);

  // node_modules/@wonderlandengine/components/dist/debug-object.js
  var __decorate4 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var DebugObject = class extends Component3 {
    /** A second object to print the name of */
    obj = null;
    start() {
      let origin = new Float32Array(3);
      quat2_exports.getTranslation(origin, this.object.transformWorld);
      console.log("Debug object:", this.object.name);
      console.log("Other object:", this.obj?.name);
      console.log("	translation", origin);
      console.log("	transformWorld", this.object.transformWorld);
      console.log("	transformLocal", this.object.transformLocal);
    }
  };
  __publicField(DebugObject, "TypeName", "debug-object");
  __decorate4([
    property.object()
  ], DebugObject.prototype, "obj", void 0);

  // node_modules/@wonderlandengine/components/dist/device-orientation-look.js
  function quatFromEulerYXZ(out, x, y, z) {
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);
    out[0] = s1 * c2 * c3 + c1 * s2 * s3;
    out[1] = c1 * s2 * c3 - s1 * c2 * s3;
    out[2] = c1 * c2 * s3 - s1 * s2 * c3;
    out[3] = c1 * c2 * c3 + s1 * s2 * s3;
  }
  var DeviceOrientationLook = class extends Component3 {
    start() {
      this.rotationX = 0;
      this.rotationY = 0;
      this.lastClientX = -1;
      this.lastClientY = -1;
    }
    init() {
      this.deviceOrientation = [0, 0, 0, 1];
      this.screenOrientation = window.innerHeight > window.innerWidth ? 0 : 90;
      this._origin = [0, 0, 0];
      window.addEventListener("deviceorientation", function(e) {
        let alpha = e.alpha || 0;
        let beta = e.beta || 0;
        let gamma = e.gamma || 0;
        const toRad = Math.PI / 180;
        quatFromEulerYXZ(this.deviceOrientation, beta * toRad, alpha * toRad, -gamma * toRad);
      }.bind(this));
      window.addEventListener("orientationchange", function(e) {
        this.screenOrientation = window.orientation || 0;
      }.bind(this), false);
    }
    update() {
      if (this.engine.xr)
        return;
      this.object.getTranslationLocal(this._origin);
      this.object.resetTransform();
      if (this.screenOrientation != 0) {
        this.object.rotateAxisAngleDeg([0, 0, -1], this.screenOrientation);
      }
      this.object.rotate([-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)]);
      this.object.rotate(this.deviceOrientation);
      this.object.translate(this._origin);
    }
  };
  __publicField(DeviceOrientationLook, "TypeName", "device-orientation-look");
  __publicField(DeviceOrientationLook, "Properties", {});

  // node_modules/@wonderlandengine/components/dist/finger-cursor.js
  var FingerCursor = class extends Component3 {
    init() {
      this.lastTarget = null;
    }
    start() {
      this.tip = this.object.getComponent("collision");
    }
    update() {
      const overlaps = this.tip.queryOverlaps();
      let overlapFound = null;
      for (let i = 0; i < overlaps.length; ++i) {
        const o = overlaps[i].object;
        const target = o.getComponent("cursor-target");
        if (target) {
          if (!target.equals(this.lastTarget)) {
            target.onHover(o, this);
            target.onClick(o, this);
          }
          overlapFound = target;
          break;
        }
      }
      if (!overlapFound) {
        if (this.lastTarget)
          this.lastTarget.onUnhover(this.lastTarget.object, this);
        this.lastTarget = null;
        return;
      } else {
        this.lastTarget = overlapFound;
      }
    }
  };
  __publicField(FingerCursor, "TypeName", "finger-cursor");
  __publicField(FingerCursor, "Properties", {});

  // node_modules/@wonderlandengine/components/dist/fixed-foveation.js
  var FixedFoveation = class extends Component3 {
    start() {
      this.onSessionStartCallback = this.setFixedFoveation.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    }
    setFixedFoveation() {
      this.engine.xr.baseLayer.fixedFoveation = this.fixedFoveation;
    }
  };
  __publicField(FixedFoveation, "TypeName", "fixed-foveation");
  __publicField(FixedFoveation, "Properties", {
    /** Amount to apply from 0 (none) to 1 (full) */
    fixedFoveation: { type: Type.Float, default: 0.5 }
  });

  // node_modules/@wonderlandengine/components/dist/hand-tracking.js
  var __decorate5 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var ORDERED_JOINTS = [
    "wrist",
    "thumb-metacarpal",
    "thumb-phalanx-proximal",
    "thumb-phalanx-distal",
    "thumb-tip",
    "index-finger-metacarpal",
    "index-finger-phalanx-proximal",
    "index-finger-phalanx-intermediate",
    "index-finger-phalanx-distal",
    "index-finger-tip",
    "middle-finger-metacarpal",
    "middle-finger-phalanx-proximal",
    "middle-finger-phalanx-intermediate",
    "middle-finger-phalanx-distal",
    "middle-finger-tip",
    "ring-finger-metacarpal",
    "ring-finger-phalanx-proximal",
    "ring-finger-phalanx-intermediate",
    "ring-finger-phalanx-distal",
    "ring-finger-tip",
    "pinky-finger-metacarpal",
    "pinky-finger-phalanx-proximal",
    "pinky-finger-phalanx-intermediate",
    "pinky-finger-phalanx-distal",
    "pinky-finger-tip"
  ];
  var invTranslation = vec3_exports.create();
  var invRotation = quat_exports.create();
  var tempVec0 = vec3_exports.create();
  var tempVec1 = vec3_exports.create();
  var HandTracking = class extends Component3 {
    /** Handedness determining whether to receive tracking input from right or left hand */
    handedness = 0;
    /** (optional) Mesh to use to visualize joints */
    jointMesh = null;
    /** Material to use for display. Applied to either the spawned skinned mesh or the joint spheres. */
    jointMaterial = null;
    /** (optional) Skin to apply tracked joint poses to. If not present,
     * joint spheres will be used for display instead. */
    handSkin = null;
    /** Deactivate children if no pose was tracked */
    deactivateChildrenWithoutPose = true;
    /** Controller objects to activate including children if no pose is available */
    controllerToDeactivate = null;
    init() {
      this.handedness = ["left", "right"][this.handedness];
    }
    joints = {};
    session = null;
    /* Whether last update had a hand pose */
    hasPose = false;
    _childrenActive = true;
    start() {
      if (!("XRHand" in window)) {
        console.warn("WebXR Hand Tracking not supported by this browser.");
        this.active = false;
        return;
      }
      if (this.handSkin) {
        const skin = this.handSkin;
        const jointIds = skin.jointIds;
        this.joints[ORDERED_JOINTS[0]] = this.engine.wrapObject(jointIds[0]);
        for (let j = 0; j < jointIds.length; ++j) {
          const joint = this.engine.wrapObject(jointIds[j]);
          this.joints[joint.name] = joint;
        }
        return;
      }
      const jointObjects = this.engine.scene.addObjects(ORDERED_JOINTS.length, this.object, ORDERED_JOINTS.length);
      for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
        const joint = jointObjects[j];
        joint.addComponent(MeshComponent, {
          mesh: this.jointMesh,
          material: this.jointMaterial
        });
        this.joints[ORDERED_JOINTS[j]] = joint;
        joint.name = ORDERED_JOINTS[j];
      }
    }
    update(dt) {
      if (!this.engine.xr)
        return;
      this.hasPose = false;
      if (this.engine.xr.session.inputSources) {
        for (let i = 0; i < this.engine.xr.session.inputSources.length; ++i) {
          const inputSource = this.engine.xr.session.inputSources[i];
          if (!inputSource?.hand || inputSource?.handedness != this.handedness)
            continue;
          const wristSpace = inputSource.hand.get("wrist");
          if (wristSpace) {
            const p = this.engine.xr.frame.getJointPose(wristSpace, this.engine.xr.currentReferenceSpace);
            if (p) {
              setXRRigidTransformLocal(this.object, p.transform);
            }
          }
          this.object.getRotationLocal(invRotation);
          quat_exports.conjugate(invRotation, invRotation);
          this.object.getPositionLocal(invTranslation);
          this.joints["wrist"].resetTransform();
          for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
            const jointName = ORDERED_JOINTS[j];
            const joint = this.joints[jointName];
            if (!joint)
              continue;
            let jointPose = null;
            const jointSpace = inputSource.hand.get(jointName);
            if (jointSpace) {
              jointPose = this.engine.xr.frame.getJointPose(jointSpace, this.engine.xr.currentReferenceSpace);
            }
            if (jointPose) {
              this.hasPose = true;
              joint.resetPositionRotation();
              joint.translateLocal([
                jointPose.transform.position.x - invTranslation[0],
                jointPose.transform.position.y - invTranslation[1],
                jointPose.transform.position.z - invTranslation[2]
              ]);
              joint.rotateLocal(invRotation);
              joint.rotateObject([
                jointPose.transform.orientation.x,
                jointPose.transform.orientation.y,
                jointPose.transform.orientation.z,
                jointPose.transform.orientation.w
              ]);
              if (!this.handSkin) {
                const r = jointPose.radius || 7e-3;
                joint.setScalingLocal([r, r, r]);
              }
            }
          }
        }
      }
      if (!this.hasPose && this._childrenActive) {
        this._childrenActive = false;
        if (this.deactivateChildrenWithoutPose) {
          this.setChildrenActive(false);
        }
        if (this.controllerToDeactivate) {
          this.controllerToDeactivate.active = true;
          this.setChildrenActive(true, this.controllerToDeactivate);
        }
      } else if (this.hasPose && !this._childrenActive) {
        this._childrenActive = true;
        if (this.deactivateChildrenWithoutPose) {
          this.setChildrenActive(true);
        }
        if (this.controllerToDeactivate) {
          this.controllerToDeactivate.active = false;
          this.setChildrenActive(false, this.controllerToDeactivate);
        }
      }
    }
    setChildrenActive(active, object) {
      object = object || this.object;
      const children = object.children;
      for (const o of children) {
        o.active = active;
        this.setChildrenActive(active, o);
      }
    }
    isGrabbing() {
      this.joints["index-finger-tip"].getPositionLocal(tempVec0);
      this.joints["thumb-tip"].getPositionLocal(tempVec1);
      return vec3_exports.sqrDist(tempVec0, tempVec1) < 1e-3;
    }
  };
  __publicField(HandTracking, "TypeName", "hand-tracking");
  __decorate5([
    property.enum(["left", "right"])
  ], HandTracking.prototype, "handedness", void 0);
  __decorate5([
    property.mesh()
  ], HandTracking.prototype, "jointMesh", void 0);
  __decorate5([
    property.material()
  ], HandTracking.prototype, "jointMaterial", void 0);
  __decorate5([
    property.skin()
  ], HandTracking.prototype, "handSkin", void 0);
  __decorate5([
    property.bool(true)
  ], HandTracking.prototype, "deactivateChildrenWithoutPose", void 0);
  __decorate5([
    property.object()
  ], HandTracking.prototype, "controllerToDeactivate", void 0);

  // node_modules/@wonderlandengine/components/dist/howler-audio-listener.js
  var import_howler = __toESM(require_howler(), 1);
  var HowlerAudioListener = class extends Component3 {
    init() {
      this.origin = new Float32Array(3);
      this.fwd = new Float32Array(3);
      this.up = new Float32Array(3);
    }
    update() {
      if (!this.spatial)
        return;
      this.object.getTranslationWorld(this.origin);
      this.object.getForward(this.fwd);
      this.object.getUp(this.up);
      Howler.pos(this.origin[0], this.origin[1], this.origin[2]);
      Howler.orientation(this.fwd[0], this.fwd[1], this.fwd[2], this.up[0], this.up[1], this.up[2]);
    }
  };
  __publicField(HowlerAudioListener, "TypeName", "howler-audio-listener");
  __publicField(HowlerAudioListener, "Properties", {
    /** Whether audio should be spatialized/positional. */
    spatial: { type: Type.Bool, default: true }
  });

  // node_modules/@wonderlandengine/components/dist/howler-audio-source.js
  var import_howler2 = __toESM(require_howler(), 1);
  var HowlerAudioSource = class extends Component3 {
    start() {
      this.audio = new Howl({
        src: [this.src],
        loop: this.loop,
        volume: this.volume,
        autoplay: this.autoplay
      });
      this.lastPlayedAudioId = null;
      this.origin = new Float32Array(3);
      this.lastOrigin = new Float32Array(3);
      if (this.spatial && this.autoplay) {
        this.updatePosition();
        this.play();
      }
    }
    update() {
      if (!this.spatial || !this.lastPlayedAudioId)
        return;
      this.object.getTranslationWorld(this.origin);
      if (Math.abs(this.lastOrigin[0] - this.origin[0]) > 5e-3 || Math.abs(this.lastOrigin[1] - this.origin[1]) > 5e-3 || Math.abs(this.lastOrigin[2] - this.origin[2]) > 5e-3) {
        this.updatePosition();
      }
    }
    updatePosition() {
      this.audio.pos(this.origin[0], this.origin[1], this.origin[2], this.lastPlayedAudioId);
      this.lastOrigin.set(this.origin);
    }
    play() {
      if (this.lastPlayedAudioId)
        this.audio.stop(this.lastPlayedAudioId);
      this.lastPlayedAudioId = this.audio.play();
      if (this.spatial)
        this.updatePosition();
    }
    stop() {
      if (!this.lastPlayedAudioId)
        return;
      this.audio.stop(this.lastPlayedAudioId);
      this.lastPlayedAudioId = null;
    }
    onDeactivate() {
      this.stop();
    }
  };
  __publicField(HowlerAudioSource, "TypeName", "howler-audio-source");
  __publicField(HowlerAudioSource, "Properties", {
    /** Volume */
    volume: { type: Type.Float, default: 1 },
    /** Whether audio should be spatialized/positional */
    spatial: { type: Type.Bool, default: true },
    /** Whether to loop the sound */
    loop: { type: Type.Bool, default: false },
    /** Whether to start playing automatically */
    autoplay: { type: Type.Bool, default: false },
    /** URL to a sound file to play */
    src: { type: Type.String, default: "" }
  });

  // node_modules/@wonderlandengine/components/dist/utils/utils.js
  function setFirstMaterialTexture(mat, texture, customTextureProperty) {
    if (customTextureProperty !== "auto") {
      mat[customTextureProperty] = texture;
      return true;
    }
    const shader = mat.shader;
    if (shader === "Flat Opaque Textured") {
      mat.flatTexture = texture;
      return true;
    } else if (shader === "Phong Opaque Textured" || shader === "Foliage" || shader === "Phong Normalmapped" || shader === "Phong Lightmapped") {
      mat.diffuseTexture = texture;
      return true;
    } else if (shader === "Particle") {
      mat.mainTexture = texture;
      return true;
    } else if (shader === "DistanceFieldVector") {
      mat.vectorTexture = texture;
      return true;
    } else if (shader === "Background" || shader === "Sky") {
      mat.texture = texture;
      return true;
    } else if (shader === "Physical Opaque Textured") {
      mat.albedoTexture = texture;
      return true;
    }
    return false;
  }
  function deg2rad(value) {
    return value * Math.PI / 180;
  }
  function rad2deg(value) {
    return value * 180 / Math.PI;
  }

  // node_modules/@wonderlandengine/components/dist/image-texture.js
  var ImageTexture = class extends Component3 {
    start() {
      if (!this.material) {
        throw Error("image-texture: material property not set");
      }
      this.engine.textures.load(this.url, "anonymous").then((texture) => {
        const mat = this.material;
        if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
          console.error("Shader", mat.shader, "not supported by image-texture");
        }
      }).catch(console.err);
    }
  };
  __publicField(ImageTexture, "TypeName", "image-texture");
  __publicField(ImageTexture, "Properties", {
    /** URL to download the image from */
    url: Property.string(),
    /** Material to apply the video texture to */
    material: Property.material(),
    /** Name of the texture property to set */
    textureProperty: Property.string("auto")
  });

  // node_modules/@wonderlandengine/components/dist/mouse-look.js
  var __decorate6 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var preventDefault = (e) => {
    e.preventDefault();
  };
  var MouseLookComponent = class extends Component3 {
    /** Mouse look sensitivity */
    sensitity = 0.25;
    /** Require a mouse button to be pressed to control view.
     * Otherwise view will allways follow mouse movement */
    requireMouseDown = true;
    /** If "moveOnClick" is enabled, mouse button which should
     * be held down to control view */
    mouseButtonIndex = 0;
    /** Enables pointer lock on "mousedown" event on canvas */
    pointerLockOnClick = false;
    currentRotationY = 0;
    currentRotationX = 0;
    origin = new Float32Array(3);
    parentOrigin = new Float32Array(3);
    rotationX = 0;
    rotationY = 0;
    mouseDown = false;
    onActivate() {
      document.addEventListener("mousemove", this.onMouseMove);
      const canvas2 = this.engine.canvas;
      if (this.pointerLockOnClick) {
        canvas2.addEventListener("mousedown", this.requestPointerLock);
      }
      if (this.requireMouseDown) {
        if (this.mouseButtonIndex === 2) {
          canvas2.addEventListener("contextmenu", preventDefault, false);
        }
        canvas2.addEventListener("mousedown", this.onMouseDown);
        canvas2.addEventListener("mouseup", this.onMouseUp);
      }
    }
    onDeactivate() {
      document.removeEventListener("mousemove", this.onMouseMove);
      const canvas2 = this.engine.canvas;
      if (this.pointerLockOnClick) {
        canvas2.removeEventListener("mousedown", this.requestPointerLock);
      }
      if (this.requireMouseDown) {
        if (this.mouseButtonIndex === 2) {
          canvas2.removeEventListener("contextmenu", preventDefault, false);
        }
        canvas2.removeEventListener("mousedown", this.onMouseDown);
        canvas2.removeEventListener("mouseup", this.onMouseUp);
      }
    }
    requestPointerLock = () => {
      const canvas2 = this.engine.canvas;
      canvas2.requestPointerLock = canvas2.requestPointerLock || canvas2.mozRequestPointerLock || canvas2.webkitRequestPointerLock;
      canvas2.requestPointerLock();
    };
    onMouseDown = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this.mouseDown = true;
        document.body.style.cursor = "grabbing";
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      }
    };
    onMouseUp = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this.mouseDown = false;
        document.body.style.cursor = "initial";
      }
    };
    onMouseMove = (e) => {
      if (this.active && (this.mouseDown || !this.requireMouseDown)) {
        this.rotationY = -this.sensitity * e.movementX / 100;
        this.rotationX = -this.sensitity * e.movementY / 100;
        this.currentRotationX += this.rotationX;
        this.currentRotationY += this.rotationY;
        this.currentRotationX = Math.min(1.507, this.currentRotationX);
        this.currentRotationX = Math.max(-1.507, this.currentRotationX);
        this.object.getPositionWorld(this.origin);
        const parent = this.object.parent;
        if (parent) {
          parent.getPositionWorld(this.parentOrigin);
          vec3_exports.sub(this.origin, this.origin, this.parentOrigin);
        }
        this.object.resetPositionRotation();
        this.object.rotateAxisAngleRadLocal([1, 0, 0], this.currentRotationX);
        this.object.rotateAxisAngleRadLocal([0, 1, 0], this.currentRotationY);
        this.object.translateLocal(this.origin);
      }
    };
  };
  __publicField(MouseLookComponent, "TypeName", "mouse-look");
  __decorate6([
    property.float(0.25)
  ], MouseLookComponent.prototype, "sensitity", void 0);
  __decorate6([
    property.bool(true)
  ], MouseLookComponent.prototype, "requireMouseDown", void 0);
  __decorate6([
    property.int()
  ], MouseLookComponent.prototype, "mouseButtonIndex", void 0);
  __decorate6([
    property.bool(false)
  ], MouseLookComponent.prototype, "pointerLockOnClick", void 0);

  // node_modules/@wonderlandengine/components/dist/player-height.js
  var __decorate7 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var PlayerHeight = class extends Component3 {
    height = 1.75;
    onSessionStartCallback;
    onSessionEndCallback;
    start() {
      this.object.resetPositionRotation();
      this.object.translateLocal([0, this.height, 0]);
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    onXRSessionStart() {
      const type = this.engine.xr?.currentReferenceSpaceType;
      if (type !== "local" && type !== "viewer") {
        this.object.resetPositionRotation();
      }
    }
    onXRSessionEnd() {
      const type = this.engine.xr?.currentReferenceSpaceType;
      if (type !== "local" && type !== "viewer") {
        this.object.resetPositionRotation();
        this.object.translateLocal([0, this.height, 0]);
      }
    }
  };
  __publicField(PlayerHeight, "TypeName", "player-height");
  __decorate7([
    property.float(1.75)
  ], PlayerHeight.prototype, "height", void 0);

  // node_modules/@wonderlandengine/components/dist/target-framerate.js
  var TargetFramerate = class extends Component3 {
    start() {
      this.onSessionStartCallback = this.setTargetFramerate.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    }
    setTargetFramerate(s) {
      if (s.supportedFrameRates && s.updateTargetFrameRate) {
        const a = this.engine.xr.session.supportedFrameRates;
        a.sort((a2, b) => Math.abs(a2 - this.framerate) - Math.abs(b - this.framerate));
        this.engine.xr.session.updateTargetFrameRate(a[0]);
      }
    }
  };
  __publicField(TargetFramerate, "TypeName", "target-framerate");
  __publicField(TargetFramerate, "Properties", {
    framerate: { type: Type.Float, default: 90 }
  });

  // node_modules/@wonderlandengine/components/dist/teleport.js
  var TeleportComponent = class extends Component3 {
    init() {
      this._prevThumbstickAxis = new Float32Array(2);
      this._tempVec = new Float32Array(3);
      this._tempVec0 = new Float32Array(3);
      this._currentIndicatorRotation = 0;
      this.input = this.object.getComponent("input");
      if (!this.input) {
        console.error(this.object.name, "generic-teleport-component.js: input component is required on the object");
        return;
      }
      if (!this.teleportIndicatorMeshObject) {
        console.error(this.object.name, "generic-teleport-component.js: Teleport indicator mesh is missing");
        return;
      }
      if (!this.camRoot) {
        console.error(this.object.name, "generic-teleport-component.js: camRoot not set");
        return;
      }
      this.isIndicating = false;
      this.indicatorHidden = true;
      this.hitSpot = new Float32Array(3);
      this._hasHit = false;
      this._extraRotation = 0;
      this._currentStickAxes = new Float32Array(2);
    }
    start() {
      if (this.cam) {
        this.isMouseIndicating = false;
        canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      }
      if (this.handedness == 0) {
        const inputComp = this.object.getComponent("input");
        if (!inputComp) {
          console.warn("teleport component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
        } else {
          this.handedness = inputComp.handedness;
          this.input = inputComp;
        }
      } else {
        this.handedness = ["left", "right"][this.handedness - 1];
      }
      this.onSessionStartCallback = this.setupVREvents.bind(this);
      this.teleportIndicatorMeshObject.active = false;
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    }
    /* Get current camera Y rotation */
    _getCamRotation() {
      this.eyeLeft.getForward(this._tempVec);
      this._tempVec[1] = 0;
      vec3_exports.normalize(this._tempVec, this._tempVec);
      return Math.atan2(this._tempVec[0], this._tempVec[2]);
    }
    update() {
      let inputLength = 0;
      if (this.gamepad && this.gamepad.axes) {
        this._currentStickAxes[0] = this.gamepad.axes[2];
        this._currentStickAxes[1] = this.gamepad.axes[3];
        inputLength = Math.abs(this._currentStickAxes[0]) + Math.abs(this._currentStickAxes[1]);
      }
      if (!this.isIndicating && this._prevThumbstickAxis[1] >= this.thumbstickActivationThreshhold && this._currentStickAxes[1] < this.thumbstickActivationThreshhold) {
        this.isIndicating = true;
      } else if (this.isIndicating && inputLength < this.thumbstickDeactivationThreshhold) {
        this.isIndicating = false;
        this.teleportIndicatorMeshObject.active = false;
        if (this._hasHit) {
          this._teleportPlayer(this.hitSpot, this._extraRotation);
        }
      }
      if (this.isIndicating && this.teleportIndicatorMeshObject && this.input) {
        const origin = this._tempVec0;
        this.object.getPositionWorld(origin);
        const direction2 = this.object.getForwardWorld(this._tempVec);
        let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
        if (rayHit.hitCount > 0) {
          this.indicatorHidden = false;
          this._extraRotation = Math.PI + Math.atan2(this._currentStickAxes[0], this._currentStickAxes[1]);
          this._currentIndicatorRotation = this._getCamRotation() + (this._extraRotation - Math.PI);
          this.teleportIndicatorMeshObject.resetPositionRotation();
          this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
          this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
          this.teleportIndicatorMeshObject.translate([
            0,
            this.indicatorYOffset,
            0
          ]);
          this.teleportIndicatorMeshObject.active = true;
          this.hitSpot.set(rayHit.locations[0]);
          this._hasHit = true;
        } else {
          if (!this.indicatorHidden) {
            this.teleportIndicatorMeshObject.active = false;
            this.indicatorHidden = true;
          }
          this._hasHit = false;
        }
      } else if (this.teleportIndicatorMeshObject && this.isMouseIndicating) {
        this.onMousePressed();
      }
      this._prevThumbstickAxis.set(this._currentStickAxes);
    }
    setupVREvents(s) {
      this.session = s;
      s.addEventListener("end", function() {
        this.gamepad = null;
        this.session = null;
      }.bind(this));
      if (s.inputSources && s.inputSources.length) {
        for (let i = 0; i < s.inputSources.length; i++) {
          let inputSource = s.inputSources[i];
          if (inputSource.handedness == this.handedness) {
            this.gamepad = inputSource.gamepad;
          }
        }
      }
      s.addEventListener("inputsourceschange", function(e) {
        if (e.added && e.added.length) {
          for (let i = 0; i < e.added.length; i++) {
            let inputSource = e.added[i];
            if (inputSource.handedness == this.handedness) {
              this.gamepad = inputSource.gamepad;
            }
          }
        }
      }.bind(this));
    }
    onMouseDown() {
      this.isMouseIndicating = true;
    }
    onMouseUp() {
      this.isMouseIndicating = false;
      this.teleportIndicatorMeshObject.active = false;
      if (this._hasHit) {
        this._teleportPlayer(this.hitSpot, 0);
      }
    }
    onMousePressed() {
      let origin = [0, 0, 0];
      this.cam.getPositionWorld(origin);
      const direction2 = this.cam.getForward(this._tempVec);
      let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
      if (rayHit.hitCount > 0) {
        this.indicatorHidden = false;
        direction2[1] = 0;
        vec3_exports.normalize(direction2, direction2);
        this._currentIndicatorRotation = -Math.sign(direction2[2]) * Math.acos(direction2[0]) - Math.PI * 0.5;
        this.teleportIndicatorMeshObject.resetPositionRotation();
        this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
        this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
        this.teleportIndicatorMeshObject.active = true;
        this.hitSpot = rayHit.locations[0];
        this._hasHit = true;
      } else {
        if (!this.indicatorHidden) {
          this.teleportIndicatorMeshObject.active = false;
          this.indicatorHidden = true;
        }
        this._hasHit = false;
      }
    }
    _teleportPlayer(newPosition, rotationToAdd) {
      this.camRoot.rotateAxisAngleRad([0, 1, 0], rotationToAdd);
      const p = this._tempVec;
      const p1 = this._tempVec0;
      if (this.session) {
        this.eyeLeft.getPositionWorld(p);
        this.eyeRight.getPositionWorld(p1);
        vec3_exports.add(p, p, p1);
        vec3_exports.scale(p, p, 0.5);
      } else {
        this.cam.getPositionWorld(p);
      }
      this.camRoot.getPositionWorld(p1);
      vec3_exports.sub(p, p1, p);
      p[0] += newPosition[0];
      p[1] = newPosition[1];
      p[2] += newPosition[2];
      this.camRoot.setPositionWorld(p);
    }
  };
  __publicField(TeleportComponent, "TypeName", "teleport");
  __publicField(TeleportComponent, "Properties", {
    /** Object that will be placed as indiciation forwhere the player will teleport to. */
    teleportIndicatorMeshObject: { type: Type.Object },
    /** Root of the player, the object that will be positioned on teleportation. */
    camRoot: { type: Type.Object },
    /** Non-vr camera for use outside of VR */
    cam: { type: Type.Object },
    /** Left eye for use in VR*/
    eyeLeft: { type: Type.Object },
    /** Right eye for use in VR*/
    eyeRight: { type: Type.Object },
    /** Handedness for VR cursors to accept trigger events only from respective controller. */
    handedness: {
      type: Type.Enum,
      values: ["input component", "left", "right", "none"],
      default: "input component"
    },
    /** Collision group of valid "floor" objects that can be teleported on */
    floorGroup: { type: Type.Int, default: 1 },
    /** How far the thumbstick needs to be pushed to have the teleport target indicator show up */
    thumbstickActivationThreshhold: { type: Type.Float, default: -0.7 },
    /** How far the thumbstick needs to be released to execute the teleport */
    thumbstickDeactivationThreshhold: { type: Type.Float, default: 0.3 },
    /** Offset to apply to the indicator object, e.g. to avoid it from Z-fighting with the floor */
    indicatorYOffset: { type: Type.Float, default: 0.01 },
    /** Mode for raycasting, whether to use PhysX or simple collision components */
    rayCastMode: {
      type: Type.Enum,
      values: ["collision", "physx"],
      default: "collision"
    },
    /** Max distance for PhysX raycast */
    maxDistance: { type: Type.Float, default: 100 }
  });

  // node_modules/@wonderlandengine/components/dist/trail.js
  var __decorate8 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var direction = vec3_exports.create();
  var offset = vec3_exports.create();
  var normal = vec3_exports.create();
  var UP = vec3_exports.fromValues(0, 1, 0);
  var Trail = class extends Component3 {
    /** The material to apply to the trail mesh */
    material = null;
    /** The number of segments in the trail mesh */
    segments = 50;
    /** The time interval before recording a new point */
    interval = 0.1;
    /** The width of the trail (in world space) */
    width = 1;
    /** Whether or not the trail should taper off */
    taper = true;
    /**
     * The maximum delta time in seconds, above which the trail resets.
     * This prevents the trail from jumping around when updates happen
     * infrequently (e.g. when the tab doesn't have focus).
     */
    resetThreshold = 0.5;
    _currentPointIndex = 0;
    _timeTillNext = 0;
    _points = [];
    _trailContainer = null;
    _meshComp = null;
    _mesh = null;
    _indexData = null;
    start() {
      this._points = new Array(this.segments + 1);
      for (let i = 0; i < this._points.length; ++i) {
        this._points[i] = vec3_exports.create();
      }
      this._timeTillNext = this.interval;
      this._trailContainer = this.engine.scene.addObject();
      this._meshComp = this._trailContainer.addComponent("mesh");
      this._meshComp.material = this.material;
      const vertexCount = 2 * this._points.length;
      this._indexData = new Uint32Array(6 * this.segments);
      for (let i = 0, v = 0; i < vertexCount - 2; i += 2, v += 6) {
        this._indexData.subarray(v, v + 6).set([i + 1, i + 0, i + 2, i + 2, i + 3, i + 1]);
      }
      this._mesh = new Mesh(this.engine, {
        vertexCount,
        indexData: this._indexData,
        indexType: MeshIndexType.UnsignedInt
      });
      this._meshComp.mesh = this._mesh;
    }
    updateVertices() {
      if (!this._mesh)
        return;
      const positions = this._mesh.attribute(MeshAttribute.Position);
      const texCoords = this._mesh.attribute(MeshAttribute.TextureCoordinate);
      const normals = this._mesh.attribute(MeshAttribute.Normal);
      vec3_exports.set(direction, 0, 0, 0);
      for (let i = 0; i < this._points.length; ++i) {
        const curr = this._points[(this._currentPointIndex + i + 1) % this._points.length];
        const next = this._points[(this._currentPointIndex + i + 2) % this._points.length];
        if (i !== this._points.length - 1) {
          vec3_exports.sub(direction, next, curr);
        }
        vec3_exports.cross(offset, UP, direction);
        vec3_exports.normalize(offset, offset);
        const timeFraction = 1 - this._timeTillNext / this.interval;
        const fraction = (i - timeFraction) / this.segments;
        vec3_exports.scale(offset, offset, (this.taper ? fraction : 1) * this.width / 2);
        positions.set(i * 2, [
          curr[0] - offset[0],
          curr[1] - offset[1],
          curr[2] - offset[2]
        ]);
        positions.set(i * 2 + 1, [
          curr[0] + offset[0],
          curr[1] + offset[1],
          curr[2] + offset[2]
        ]);
        if (normals) {
          vec3_exports.cross(normal, direction, offset);
          vec3_exports.normalize(normal, normal);
          normals.set(i * 2, normal);
          normals.set(i * 2 + 1, normal);
        }
        if (texCoords) {
          texCoords.set(i * 2, [0, fraction]);
          texCoords.set(i * 2 + 1, [1, fraction]);
        }
      }
      this._mesh.update();
    }
    resetTrail() {
      this.object.getPositionWorld(this._points[0]);
      for (let i = 1; i < this._points.length; ++i) {
        vec3_exports.copy(this._points[i], this._points[0]);
      }
      this._currentPointIndex = 0;
      this._timeTillNext = this.interval;
    }
    update(dt) {
      this._timeTillNext -= dt;
      if (dt > this.resetThreshold) {
        this.resetTrail();
      }
      if (this._timeTillNext < 0) {
        this._currentPointIndex = (this._currentPointIndex + 1) % this._points.length;
        this._timeTillNext = this._timeTillNext % this.interval + this.interval;
      }
      this.object.getPositionWorld(this._points[this._currentPointIndex]);
      this.updateVertices();
    }
    onActivate() {
      this.resetTrail();
      if (this._meshComp)
        this._meshComp.active = true;
    }
    onDeactivate() {
      if (this._meshComp)
        this._meshComp.active = false;
    }
    onDestroy() {
      if (this._trailContainer)
        this._trailContainer.destroy();
      if (this._meshComp)
        this._meshComp.destroy();
      if (this._mesh)
        this._mesh.destroy();
    }
  };
  __publicField(Trail, "TypeName", "trail");
  __decorate8([
    property.material()
  ], Trail.prototype, "material", void 0);
  __decorate8([
    property.int(50)
  ], Trail.prototype, "segments", void 0);
  __decorate8([
    property.float(50)
  ], Trail.prototype, "interval", void 0);
  __decorate8([
    property.float(1)
  ], Trail.prototype, "width", void 0);
  __decorate8([
    property.bool(true)
  ], Trail.prototype, "taper", void 0);
  __decorate8([
    property.float(1)
  ], Trail.prototype, "resetThreshold", void 0);

  // node_modules/@wonderlandengine/components/dist/two-joint-ik-solver.js
  function clamp(v, a, b) {
    return Math.max(a, Math.min(v, b));
  }
  var rootScaling = new Float32Array(3);
  var tempQuat3 = new Float32Array(4);
  var middlePos = new Float32Array(3);
  var endPos = new Float32Array(3);
  var targetPos = new Float32Array(3);
  var helperPos = new Float32Array(3);
  var rootTransform = new Float32Array(8);
  var middleTransform = new Float32Array(8);
  var endTransform = new Float32Array(8);
  var twoJointIK = function() {
    const ta = new Float32Array(3);
    const ca = new Float32Array(3);
    const ba = new Float32Array(3);
    const ab = new Float32Array(3);
    const cb = new Float32Array(3);
    const axis0 = new Float32Array(3);
    const axis1 = new Float32Array(3);
    const temp = new Float32Array(3);
    return function(root, middle, b, c, targetPos2, eps, helper) {
      ba.set(b);
      const lab = vec3_exports.length(ba);
      vec3_exports.sub(ta, b, c);
      const lcb = vec3_exports.length(ta);
      ta.set(targetPos2);
      const lat = clamp(vec3_exports.length(ta), eps, lab + lcb - eps);
      ca.set(c);
      vec3_exports.scale(ab, b, -1);
      vec3_exports.sub(cb, c, b);
      vec3_exports.normalize(ca, ca);
      vec3_exports.normalize(ba, ba);
      vec3_exports.normalize(ab, ab);
      vec3_exports.normalize(cb, cb);
      vec3_exports.normalize(ta, ta);
      const ac_ab_0 = Math.acos(clamp(vec3_exports.dot(ca, ba), -1, 1));
      const ba_bc_0 = Math.acos(clamp(vec3_exports.dot(ab, cb), -1, 1));
      const ac_at_0 = Math.acos(clamp(vec3_exports.dot(ca, ta), -1, 1));
      const ac_ab_1 = Math.acos(clamp((lcb * lcb - lab * lab - lat * lat) / (-2 * lab * lat), -1, 1));
      const ba_bc_1 = Math.acos(clamp((lat * lat - lab * lab - lcb * lcb) / (-2 * lab * lcb), -1, 1));
      if (helper) {
        vec3_exports.sub(ba, helper, b);
        vec3_exports.normalize(ba, ba);
      }
      vec3_exports.cross(axis0, ca, ba);
      vec3_exports.normalize(axis0, axis0);
      vec3_exports.cross(axis1, c, targetPos2);
      vec3_exports.normalize(axis1, axis1);
      middle.transformVectorInverseLocal(temp, axis0);
      root.rotateAxisAngleRadObject(axis1, ac_at_0);
      root.rotateAxisAngleRadObject(axis0, ac_ab_1 - ac_ab_0);
      middle.rotateAxisAngleRadObject(axis0, ba_bc_1 - ba_bc_0);
    };
  }();
  var TwoJointIkSolver = class extends Component3 {
    time = 0;
    start() {
      this.root.getTransformLocal(rootTransform);
      this.middle.getTransformLocal(middleTransform);
      this.end.getTransformLocal(endTransform);
    }
    update(dt) {
      this.time += dt;
      this.root.setTransformLocal(rootTransform);
      this.middle.setTransformLocal(middleTransform);
      this.end.setTransformLocal(endTransform);
      this.root.getScalingWorld(rootScaling);
      this.middle.getPositionLocal(middlePos);
      this.end.getPositionLocal(endPos);
      this.middle.transformPointLocal(endPos, endPos);
      if (this.helper) {
        this.helper.getPositionWorld(helperPos);
        this.root.transformPointInverseWorld(helperPos, helperPos);
        vec3_exports.div(helperPos, helperPos, rootScaling);
      }
      this.target.getPositionWorld(targetPos);
      this.root.transformPointInverseWorld(targetPos, targetPos);
      vec3_exports.div(targetPos, targetPos, rootScaling);
      twoJointIK(this.root, this.middle, middlePos, endPos, targetPos, 0.01, this.helper ? helperPos : null, this.time);
      if (this.copyTargetRotation) {
        this.end.setRotationWorld(this.target.getRotationWorld(tempQuat3));
      }
    }
  };
  __publicField(TwoJointIkSolver, "TypeName", "two-joint-ik-solver");
  __publicField(TwoJointIkSolver, "Properties", {
    /** Root bone, never moves */
    root: Property.object(),
    /** Bone attached to the root */
    middle: Property.object(),
    /** Bone attached to the middle */
    end: Property.object(),
    /** Target the joins should reach for */
    target: Property.object(),
    /** Flag for copying rotation from target to end */
    copyTargetRotation: Property.bool(true),
    /** Helper object to use to determine joint rotation axis */
    helper: Property.object()
  });

  // node_modules/@wonderlandengine/components/dist/video-texture.js
  var VideoTexture = class extends Component3 {
    init() {
      if (!this.material) {
        throw Error("video-texture: material property not set");
      }
      this.loaded = false;
      this.frameUpdateRequested = true;
    }
    start() {
      this.video = document.createElement("video");
      this.video.src = this.url;
      this.video.crossOrigin = "anonymous";
      this.video.playsInline = true;
      this.video.loop = this.loop;
      this.video.muted = this.muted;
      this.video.addEventListener("playing", () => {
        this.loaded = true;
      });
      if (this.autoplay) {
        const playAfterUserGesture = () => {
          this.video.play();
          window.removeEventListener("click", playAfterUserGesture);
          window.removeEventListener("touchstart", playAfterUserGesture);
        };
        window.addEventListener("click", playAfterUserGesture);
        window.addEventListener("touchstart", playAfterUserGesture);
      }
    }
    applyTexture() {
      const mat = this.material;
      const shader = mat.shader;
      const texture = this.texture = new Texture(this.engine, this.video);
      if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
        console.error("Shader", shader, "not supported by video-texture");
      }
      if ("requestVideoFrameCallback" in this.video) {
        this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
      } else {
        this.video.addEventListener("timeupdate", () => {
          this.frameUpdateRequested = true;
        });
      }
    }
    update(dt) {
      if (this.loaded && this.frameUpdateRequested) {
        if (this.texture) {
          this.texture.update();
        } else {
          this.applyTexture();
        }
        this.frameUpdateRequested = false;
      }
    }
    updateVideo() {
      this.frameUpdateRequested = true;
      this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
    }
  };
  __publicField(VideoTexture, "TypeName", "video-texture");
  __publicField(VideoTexture, "Properties", {
    /** URL to download video from */
    url: Property.string(),
    /** Material to apply the video texture to */
    material: Property.material(),
    /** Whether to loop the video */
    loop: Property.bool(true),
    /** Whether to automatically start playing the video */
    autoplay: Property.bool(true),
    /** Whether to mute sound */
    muted: Property.bool(true),
    /** Name of the texture property to set */
    textureProperty: Property.string("auto")
  });

  // node_modules/@wonderlandengine/components/dist/vr-mode-active-switch.js
  var VrModeActiveSwitch = class extends Component3 {
    start() {
      this.components = [];
      this.getComponents(this.object);
      this.onXRSessionEnd();
      this.onSessionStartCallback = this.onXRSessionStart.bind(this);
      this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }
    onActivate() {
      this.engine.onXRSessionStart.add(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }
    onDeactivate() {
      this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
      this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }
    getComponents(obj) {
      const comps = obj.getComponents().filter((c) => c.type !== "vr-mode-active-switch");
      this.components = this.components.concat(comps);
      if (this.affectChildren) {
        let children = obj.children;
        for (let i = 0; i < children.length; ++i) {
          this.getComponents(children[i]);
        }
      }
    }
    setComponentsActive(active) {
      const comps = this.components;
      for (let i = 0; i < comps.length; ++i) {
        comps[i].active = active;
      }
    }
    onXRSessionStart() {
      this.setComponentsActive(this.activateComponents == 0);
    }
    onXRSessionEnd() {
      this.setComponentsActive(this.activateComponents != 0);
    }
  };
  __publicField(VrModeActiveSwitch, "TypeName", "vr-mode-active-switch");
  __publicField(VrModeActiveSwitch, "Properties", {
    /** When components should be active: In VR or when not in VR */
    activateComponents: {
      type: Type.Enum,
      values: ["in VR", "in non-VR"],
      default: "in VR"
    },
    /** Whether child object's components should be affected */
    affectChildren: { type: Type.Bool, default: true }
  });

  // node_modules/@wonderlandengine/components/dist/plane-detection.js
  var import_earcut = __toESM(require_earcut(), 1);
  var __decorate9 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var tempVec32 = new Float32Array(3);
  function extentsFromContour(out, points) {
    if (points.length == 0)
      return out;
    let absMaxX = Math.abs(points[0].x);
    let absMaxZ = Math.abs(points[0].z);
    for (let i = 1; i < points.length; ++i) {
      absMaxX = Math.max(absMaxX, Math.abs(points[i].x));
      absMaxZ = Math.max(absMaxZ, Math.abs(points[i].z));
    }
    out[0] = absMaxX;
    out[1] = 0;
    out[2] = absMaxZ;
  }
  function within(x, a, b) {
    if (a > b)
      return x < a && x > b;
    return x > a && x < b;
  }
  function isPointLocalOnXRPlanePolygon(p, plane) {
    const points = plane.polygon;
    if (points.length < 3)
      return false;
    const pX = p[0];
    const pZ = p[2];
    let intersections = 0;
    for (let n = 0, l2 = points.length - 1; n < points.length; ++n) {
      const aX = points[l2].x;
      const aZ = points[l2].z;
      const s = (points[n].z - aZ) / (points[n].x - aX);
      const x = Math.abs((pZ - aZ) / s);
      if (x >= 0 && x <= 1 && within(x + pX, aX, points[n].x))
        ++intersections;
      l2 = n;
    }
    return (intersections & 1) == 0;
  }
  function isPointWorldOnXRPlanePolygon(object, p, plane) {
    if (plane.polygon.length < 3)
      return false;
    isPointLocalOnXRPlanePolygon(object.transformPointInverseWorld(tempVec32, p), plane);
  }
  function planeMeshFromContour(engine, points, meshToUpdate = null) {
    const vertexCount = points.length;
    const vertices = new Float32Array(vertexCount * 2);
    for (let i = 0, d = 0; i < vertexCount; ++i, d += 2) {
      vertices[d] = points[i].x;
      vertices[d + 1] = points[i].z;
    }
    const triangles = (0, import_earcut.default)(vertices);
    const mesh = meshToUpdate || new Mesh(engine, {
      vertexCount,
      /* Assumption here that we will never have more than 256 points
       * in the detected plane meshes! */
      indexType: MeshIndexType.UnsignedByte,
      indexData: triangles
    });
    if (mesh.vertexCount !== vertexCount) {
      console.warn("vertexCount of meshToUpdate did not match required vertexCount");
      return mesh;
    }
    const positions = mesh.attribute(MeshAttribute.Position);
    const textureCoords = mesh.attribute(MeshAttribute.TextureCoordinate);
    const normals = mesh.attribute(MeshAttribute.Normal);
    tempVec32[1] = 0;
    for (let i = 0, s = 0; i < vertexCount; ++i, s += 2) {
      tempVec32[0] = vertices[s];
      tempVec32[2] = vertices[s + 1];
      positions.set(i, tempVec32);
    }
    textureCoords?.set(0, vertices);
    if (normals) {
      tempVec32[0] = 0;
      tempVec32[1] = 1;
      tempVec32[2] = 0;
      for (let i = 0; i < vertexCount; ++i) {
        normals.set(i, tempVec32);
      }
    }
    if (meshToUpdate)
      mesh.update();
    return mesh;
  }
  var _planeLost, planeLost_fn, _planeFound, planeFound_fn, _planeUpdate, planeUpdate_fn, _planeUpdatePose, planeUpdatePose_fn;
  var PlaneDetection = class extends Component3 {
    constructor() {
      super(...arguments);
      __privateAdd(this, _planeLost);
      __privateAdd(this, _planeFound);
      __privateAdd(this, _planeUpdate);
      __privateAdd(this, _planeUpdatePose);
      /**
       * Material to assign to created plane meshes or `null` if meshes should not be created.
       */
      __publicField(this, "planeMaterial", null);
      /**
       * Collision mask to assign to newly created collision components or a negative value if
       * collision components should not be created.
       */
      __publicField(this, "collisionMask", -1);
      /** Map of all planes and their last updated timestamps */
      __publicField(this, "planes", /* @__PURE__ */ new Map());
      /** Objects generated for each XRPlane */
      __publicField(this, "planeObjects", /* @__PURE__ */ new Map());
      /** Called when a plane starts tracking */
      __publicField(this, "onPlaneFound", new Emitter());
      /** Called when a plane stops tracking */
      __publicField(this, "onPlaneLost", new Emitter());
    }
    update() {
      if (!this.engine.xr?.frame)
        return;
      if (this.engine.xr.frame.detectedPlanes === void 0) {
        console.error("plane-detection: WebXR feature not available.");
        this.active = false;
        return;
      }
      const detectedPlanes = this.engine.xr.frame.detectedPlanes;
      for (const [plane, _] of this.planes) {
        if (!detectedPlanes.has(plane)) {
          __privateMethod(this, _planeLost, planeLost_fn).call(this, plane);
        }
      }
      detectedPlanes.forEach((plane) => {
        if (this.planes.has(plane)) {
          if (plane.lastChangedTime > this.planes.get(plane)) {
            __privateMethod(this, _planeUpdate, planeUpdate_fn).call(this, plane);
          }
        } else {
          __privateMethod(this, _planeFound, planeFound_fn).call(this, plane);
        }
        __privateMethod(this, _planeUpdatePose, planeUpdatePose_fn).call(this, plane);
      });
    }
  };
  _planeLost = new WeakSet();
  planeLost_fn = function(plane) {
    this.planes.delete(plane);
    const o = this.planeObjects.get(plane);
    this.onPlaneLost.notify(plane, o);
    if (o.objectId > 0)
      o.destroy();
  };
  _planeFound = new WeakSet();
  planeFound_fn = function(plane) {
    this.planes.set(plane, plane.lastChangedTime);
    const o = this.engine.scene.addObject(this.object);
    this.planeObjects.set(plane, o);
    if (this.planeMaterial) {
      o.addComponent(MeshComponent, {
        mesh: planeMeshFromContour(this.engine, plane.polygon),
        material: this.planeMaterial
      });
    }
    if (this.collisionMask >= 0) {
      extentsFromContour(tempVec32, plane.polygon);
      tempVec32[1] = 0.025;
      o.addComponent(CollisionComponent, {
        group: this.collisionMask,
        collider: Collider.Box,
        extents: tempVec32
      });
    }
    this.onPlaneFound.notify(plane, o);
  };
  _planeUpdate = new WeakSet();
  planeUpdate_fn = function(plane) {
    this.planes.set(plane, plane.lastChangedTime);
    const planeMesh = this.planeObjects.get(plane).getComponent(MeshComponent);
    if (!planeMesh)
      return;
    planeMeshFromContour(this.engine, plane.polygon, planeMesh.mesh);
  };
  _planeUpdatePose = new WeakSet();
  planeUpdatePose_fn = function(plane) {
    const o = this.planeObjects.get(plane);
    const pose = this.engine.xr.frame.getPose(plane.planeSpace, this.engine.xr.currentReferenceSpace);
    if (!pose) {
      o.active = false;
      return;
    }
    setXRRigidTransformLocal(o, pose.transform);
  };
  __publicField(PlaneDetection, "TypeName", "plane-detection");
  __decorate9([
    property.material()
  ], PlaneDetection.prototype, "planeMaterial", void 0);
  __decorate9([
    property.int()
  ], PlaneDetection.prototype, "collisionMask", void 0);

  // node_modules/@wonderlandengine/components/dist/vrm.js
  var VRM_ROLL_AXES = {
    X: [1, 0, 0],
    Y: [0, 1, 0],
    Z: [0, 0, 1]
  };
  var VRM_AIM_AXES = {
    PositiveX: [1, 0, 0],
    NegativeX: [-1, 0, 0],
    PositiveY: [0, 1, 0],
    NegativeY: [0, -1, 0],
    PositiveZ: [0, 0, 1],
    NegativeZ: [0, 0, -1]
  };
  var Vrm = class extends Component3 {
    /** Meta information about the VRM model */
    meta = null;
    /** The humanoid bones of the VRM model */
    bones = {
      /* Torso */
      hips: null,
      spine: null,
      chest: null,
      upperChest: null,
      neck: null,
      /* Head */
      head: null,
      leftEye: null,
      rightEye: null,
      jaw: null,
      /* Legs */
      leftUpperLeg: null,
      leftLowerLeg: null,
      leftFoot: null,
      leftToes: null,
      rightUpperLeg: null,
      rightLowerLeg: null,
      rightFoot: null,
      rightToes: null,
      /* Arms */
      leftShoulder: null,
      leftUpperArm: null,
      leftLowerArm: null,
      leftHand: null,
      rightShoulder: null,
      rightUpperArm: null,
      rightLowerArm: null,
      rightHand: null,
      /* Fingers */
      leftThumbMetacarpal: null,
      leftThumbProximal: null,
      leftThumbDistal: null,
      leftIndexProximal: null,
      leftIndexIntermediate: null,
      leftIndexDistal: null,
      leftMiddleProximal: null,
      leftMiddleIntermediate: null,
      leftMiddleDistal: null,
      leftRingProximal: null,
      leftRingIntermediate: null,
      leftRingDistal: null,
      leftLittleProximal: null,
      leftLittleIntermediate: null,
      leftLittleDistal: null,
      rightThumbMetacarpal: null,
      rightThumbProximal: null,
      rightThumbDistal: null,
      rightIndexProximal: null,
      rightIndexIntermediate: null,
      rightIndexDistal: null,
      rightMiddleProximal: null,
      rightMiddleIntermediate: null,
      rightMiddleDistal: null,
      rightRingProximal: null,
      rightRingIntermediate: null,
      rightRingDistal: null,
      rightLittleProximal: null,
      rightLittleIntermediate: null,
      rightLittleDistal: null
    };
    /** Rotations of the bones in the rest pose (T-pose) */
    restPose = {};
    /* All node constraints, ordered to deal with dependencies */
    _nodeConstraints = [];
    /* VRMC_springBone chains */
    _springChains = [];
    /* Spherical colliders for spring bones */
    _sphereColliders = [];
    /* Capsule shaped colliders for spring bones */
    _capsuleColliders = [];
    /* Indicates which meshes are rendered in first/third person views */
    _firstPersonAnnotations = [];
    /* Contains details for (bone type) lookAt behaviour */
    _lookAt = null;
    /* Whether or not the VRM component has been initialized with `initializeVrm` */
    _initialized = false;
    init() {
      this._tempV3 = vec3_exports.create();
      this._tempV3A = vec3_exports.create();
      this._tempV3B = vec3_exports.create();
      this._tempQuat = quat_exports.create();
      this._tempQuatA = quat_exports.create();
      this._tempQuatB = quat_exports.create();
      this._tempMat4A = mat4_exports.create();
      this._tempQuat2 = quat2_exports.create();
      this._tailToShape = vec3_exports.create();
      this._headToTail = vec3_exports.create();
      this._inertia = vec3_exports.create();
      this._stiffness = vec3_exports.create();
      this._external = vec3_exports.create();
      this._rightVector = vec3_exports.set(vec3_exports.create(), 1, 0, 0);
      this._upVector = vec3_exports.set(vec3_exports.create(), 0, 1, 0);
      this._forwardVector = vec3_exports.set(vec3_exports.create(), 0, 0, 1);
      this._identityQuat = quat_exports.identity(quat_exports.create());
      this._rad2deg = 180 / Math.PI;
    }
    start() {
      if (!this.src) {
        console.error("vrm: src property not set");
        return;
      }
      this.engine.scene.append(this.src, { loadGltfExtensions: true }).then(({ root, extensions }) => {
        root.children.forEach((child) => child.parent = this.object);
        this._initializeVrm(extensions);
        root.destroy();
      });
    }
    /**
     * Parses the VRM glTF extensions and initializes the vrm component.
     * @param {GLTFExtensions} extensions The glTF extensions for the VRM model
     */
    _initializeVrm(extensions) {
      if (this._initialized) {
        throw Error("VRM component has already been initialized");
      }
      const VRMC_vrm = extensions.root["VRMC_vrm"];
      if (!VRMC_vrm) {
        throw Error("Missing VRM extensions");
      }
      if (VRMC_vrm.specVersion !== "1.0") {
        throw Error(`Unsupported VRM version, only 1.0 is supported, but encountered '${VRMC_vrm.specVersion}'`);
      }
      this.meta = VRMC_vrm.meta;
      this._parseHumanoid(VRMC_vrm.humanoid, extensions);
      if (VRMC_vrm.firstPerson) {
        this._parseFirstPerson(VRMC_vrm.firstPerson, extensions);
      }
      if (VRMC_vrm.lookAt) {
        this._parseLookAt(VRMC_vrm.lookAt);
      }
      this._findAndParseNodeConstraints(extensions);
      const springBone = extensions.root["VRMC_springBone"];
      if (springBone) {
        this._parseAndInitializeSpringBones(springBone, extensions);
      }
      this._initialized = true;
    }
    _parseHumanoid(humanoid, extensions) {
      for (const boneName in humanoid.humanBones) {
        if (!(boneName in this.bones)) {
          console.warn(`Unrecognized bone '${boneName}'`);
          continue;
        }
        const node = humanoid.humanBones[boneName].node;
        const objectId = extensions.idMapping[node];
        this.bones[boneName] = this.engine.wrapObject(objectId);
        this.restPose[boneName] = quat_exports.copy(quat_exports.create(), this.bones[boneName].rotationLocal);
      }
    }
    _parseFirstPerson(firstPerson, extensions) {
      for (const meshAnnotation of firstPerson.meshAnnotations) {
        const annotation = {
          node: this.engine.wrapObject(extensions.idMapping[meshAnnotation.node]),
          firstPerson: true,
          thirdPerson: true
        };
        switch (meshAnnotation.type) {
          case "firstPersonOnly":
            annotation.thirdPerson = false;
            break;
          case "thirdPersonOnly":
            annotation.firstPerson = false;
            break;
          case "both":
            break;
          case "auto":
            console.warn("First person mesh annotation type 'auto' is not supported, treating as 'both'!");
            break;
          default:
            console.error(`Invalid mesh annotation type '${meshAnnotation.type}'`);
            break;
        }
        this._firstPersonAnnotations.push(annotation);
      }
    }
    _parseLookAt(lookAt2) {
      if (lookAt2.type !== "bone") {
        console.warn(`Unsupported lookAt type '${lookAt2.type}', only 'bone' is supported`);
        return;
      }
      const parseRangeMap = (rangeMap) => {
        return {
          inputMaxValue: rangeMap.inputMaxValue,
          outputScale: rangeMap.outputScale
        };
      };
      this._lookAt = {
        offsetFromHeadBone: lookAt2.offsetFromHeadBone || [0, 0, 0],
        horizontalInner: parseRangeMap(lookAt2.rangeMapHorizontalInner),
        horizontalOuter: parseRangeMap(lookAt2.rangeMapHorizontalOuter),
        verticalDown: parseRangeMap(lookAt2.rangeMapVerticalDown),
        verticalUp: parseRangeMap(lookAt2.rangeMapVerticalUp)
      };
    }
    _findAndParseNodeConstraints(extensions) {
      const traverse = (object) => {
        const nodeExtensions = extensions.node[object.objectId];
        if (nodeExtensions && "VRMC_node_constraint" in nodeExtensions) {
          const nodeConstraintExtension = nodeExtensions["VRMC_node_constraint"];
          const constraint = nodeConstraintExtension.constraint;
          let type, axis;
          if ("roll" in constraint) {
            type = "roll";
            axis = VRM_ROLL_AXES[constraint.roll.rollAxis];
          } else if ("aim" in constraint) {
            type = "aim";
            axis = VRM_AIM_AXES[constraint.aim.aimAxis];
          } else if ("rotation" in constraint) {
            type = "rotation";
          }
          if (type) {
            const source = this.engine.wrapObject(extensions.idMapping[constraint[type].source]);
            this._nodeConstraints.push({
              type,
              source,
              destination: object,
              axis,
              weight: constraint[type].weight,
              /* Rest pose */
              destinationRestLocalRotation: quat_exports.copy(quat_exports.create(), object.rotationLocal),
              sourceRestLocalRotation: quat_exports.copy(quat_exports.create(), source.rotationLocal),
              sourceRestLocalRotationInv: quat_exports.invert(quat_exports.create(), source.rotationLocal)
            });
          } else {
            console.warn("Unrecognized or invalid VRMC_node_constraint, ignoring it");
          }
        }
        for (const child of object.children) {
          traverse(child);
        }
      };
      traverse(this.object);
    }
    _parseAndInitializeSpringBones(springBone, extensions) {
      const colliders = (springBone.colliders || []).map((collider, i) => {
        const shapeType = "capsule" in collider.shape ? "capsule" : "sphere";
        return {
          id: i,
          object: this.engine.wrapObject(extensions.idMapping[collider.node]),
          shape: {
            isCapsule: shapeType === "capsule",
            radius: collider.shape[shapeType].radius,
            offset: collider.shape[shapeType].offset,
            tail: collider.shape[shapeType].tail
          },
          cache: {
            head: vec3_exports.create(),
            tail: vec3_exports.create()
          }
        };
      });
      this._sphereColliders = colliders.filter((c) => !c.shape.isCapsule);
      this._capsuleColliders = colliders.filter((c) => c.shape.isCapsule);
      const colliderGroups = (springBone.colliderGroups || []).map((group) => ({
        name: group.name,
        colliders: group.colliders.map((c) => colliders[c])
      }));
      for (const spring of springBone.springs) {
        const joints = [];
        for (const joint of spring.joints) {
          const springJoint = {
            hitRadius: 0,
            stiffness: 1,
            gravityPower: 0,
            gravityDir: [0, -1, 0],
            dragForce: 0.5,
            node: null,
            state: null
          };
          Object.assign(springJoint, joint);
          springJoint.node = this.engine.wrapObject(extensions.idMapping[springJoint.node]);
          joints.push(springJoint);
        }
        const springChainColliders = (spring.colliderGroups || []).flatMap((cg) => colliderGroups[cg].colliders);
        this._springChains.push({
          name: spring.name,
          center: spring.center ? this.engine.wrapObject(extensions.idMapping[spring.center]) : null,
          joints,
          sphereColliders: springChainColliders.filter((c) => !c.shape.isCapsule),
          capsuleColliders: springChainColliders.filter((c) => c.shape.isCapsule)
        });
      }
      for (const springChain of this._springChains) {
        for (let i = 0; i < springChain.joints.length - 1; ++i) {
          const springBoneJoint = springChain.joints[i];
          const childSpringBoneJoint = springChain.joints[i + 1];
          const springBonePosition = springBoneJoint.node.getTranslationWorld(vec3_exports.create());
          const childSpringBonePosition = childSpringBoneJoint.node.getTranslationWorld(vec3_exports.create());
          const boneDirection = vec3_exports.subtract(this._tempV3A, springBonePosition, childSpringBonePosition);
          const state = {
            prevTail: childSpringBonePosition,
            currentTail: vec3_exports.copy(vec3_exports.create(), childSpringBonePosition),
            initialLocalRotation: quat_exports.copy(quat_exports.create(), springBoneJoint.node.rotationLocal),
            initialLocalTransformInvert: quat2_exports.invert(quat2_exports.create(), springBoneJoint.node.transformLocal),
            boneAxis: vec3_exports.normalize(vec3_exports.create(), childSpringBoneJoint.node.getTranslationLocal(this._tempV3)),
            /* Ensure bone length is at least 1cm to avoid jittery behaviour from zero-length bones */
            boneLength: Math.max(0.01, vec3_exports.length(boneDirection)),
            /* Tail positions in center space, if needed */
            prevTailCenter: null,
            currentTailCenter: null
          };
          if (springChain.center) {
            state.prevTailCenter = springChain.center.transformPointInverseWorld(vec3_exports.create(), childSpringBonePosition);
            state.currentTailCenter = vec3_exports.copy(vec3_exports.create(), childSpringBonePosition);
          }
          springBoneJoint.state = state;
        }
      }
    }
    update(dt) {
      if (!this._initialized) {
        return;
      }
      this._resolveLookAt();
      this._resolveConstraints();
      this._updateSpringBones(dt);
    }
    _rangeMap(rangeMap, input) {
      const maxValue = rangeMap.inputMaxValue;
      const outputScale = rangeMap.outputScale;
      return Math.min(input, maxValue) / maxValue * outputScale;
    }
    _resolveLookAt() {
      if (!this._lookAt || !this.lookAtTarget) {
        return;
      }
      const lookAtSource = this.bones.head.transformPointWorld(this._tempV3A, this._lookAt.offsetFromHeadBone);
      const lookAtTarget = this.lookAtTarget.getTranslationWorld(this._tempV3B);
      const lookAtDirection = vec3_exports.sub(this._tempV3A, lookAtTarget, lookAtSource);
      vec3_exports.normalize(lookAtDirection, lookAtDirection);
      this.bones.head.parent.transformVectorInverseWorld(lookAtDirection);
      const z = vec3_exports.dot(lookAtDirection, this._forwardVector);
      const x = vec3_exports.dot(lookAtDirection, this._rightVector);
      const yaw = Math.atan2(x, z) * this._rad2deg;
      const xz = Math.sqrt(x * x + z * z);
      const y = vec3_exports.dot(lookAtDirection, this._upVector);
      let pitch = Math.atan2(-y, xz) * this._rad2deg;
      if (pitch > 0) {
        pitch = this._rangeMap(this._lookAt.verticalDown, pitch);
      } else {
        pitch = -this._rangeMap(this._lookAt.verticalUp, -pitch);
      }
      if (this.bones.leftEye) {
        let yawLeft = yaw;
        if (yawLeft > 0) {
          yawLeft = this._rangeMap(this._lookAt.horizontalInner, yawLeft);
        } else {
          yawLeft = -this._rangeMap(this._lookAt.horizontalOuter, -yawLeft);
        }
        const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawLeft, 0);
        this.bones.leftEye.rotationLocal = quat_exports.multiply(eyeRotation, this.restPose.leftEye, eyeRotation);
      }
      if (this.bones.rightEye) {
        let yawRight = yaw;
        if (yawRight > 0) {
          yawRight = this._rangeMap(this._lookAt.horizontalOuter, yawRight);
        } else {
          yawRight = -this._rangeMap(this._lookAt.horizontalInner, -yawRight);
        }
        const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawRight, 0);
        this.bones.rightEye.rotationLocal = quat_exports.multiply(eyeRotation, this.restPose.rightEye, eyeRotation);
      }
    }
    _resolveConstraints() {
      for (const nodeConstraint of this._nodeConstraints) {
        this._resolveConstraint(nodeConstraint);
      }
    }
    _resolveConstraint(nodeConstraint) {
      const dstRestQuat = nodeConstraint.destinationRestLocalRotation;
      const srcRestQuatInv = nodeConstraint.sourceRestLocalRotationInv;
      const targetQuat = quat_exports.identity(this._tempQuatA);
      switch (nodeConstraint.type) {
        case "roll":
          {
            const deltaSrcQuat = quat_exports.multiply(this._tempQuatA, srcRestQuatInv, nodeConstraint.source.rotationLocal);
            const deltaSrcQuatInParent = quat_exports.multiply(this._tempQuatA, nodeConstraint.sourceRestLocalRotation, deltaSrcQuat);
            quat_exports.mul(deltaSrcQuatInParent, deltaSrcQuatInParent, srcRestQuatInv);
            const dstRestQuatInv = quat_exports.invert(this._tempQuatB, dstRestQuat);
            const deltaSrcQuatInDst = quat_exports.multiply(this._tempQuatB, dstRestQuatInv, deltaSrcQuatInParent);
            quat_exports.multiply(deltaSrcQuatInDst, deltaSrcQuatInDst, dstRestQuat);
            const toVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, deltaSrcQuatInDst);
            const fromToQuat = quat_exports.rotationTo(this._tempQuatA, nodeConstraint.axis, toVec);
            quat_exports.mul(targetQuat, dstRestQuat, quat_exports.invert(this._tempQuat, fromToQuat));
            quat_exports.mul(targetQuat, targetQuat, deltaSrcQuatInDst);
          }
          break;
        case "aim":
          {
            const dstParentWorldQuat = nodeConstraint.destination.parent.rotationWorld;
            const fromVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, dstRestQuat);
            vec3_exports.transformQuat(fromVec, fromVec, dstParentWorldQuat);
            const toVec = nodeConstraint.source.getTranslationWorld(this._tempV3B);
            vec3_exports.sub(toVec, toVec, nodeConstraint.destination.getTranslationWorld(this._tempV3));
            vec3_exports.normalize(toVec, toVec);
            const fromToQuat = quat_exports.rotationTo(this._tempQuatA, fromVec, toVec);
            quat_exports.mul(targetQuat, quat_exports.invert(this._tempQuat, dstParentWorldQuat), fromToQuat);
            quat_exports.mul(targetQuat, targetQuat, dstParentWorldQuat);
            quat_exports.mul(targetQuat, targetQuat, dstRestQuat);
          }
          break;
        case "rotation":
          {
            const srcDeltaQuat = quat_exports.mul(targetQuat, srcRestQuatInv, nodeConstraint.source.rotationLocal);
            quat_exports.mul(targetQuat, dstRestQuat, srcDeltaQuat);
          }
          break;
      }
      quat_exports.slerp(targetQuat, dstRestQuat, targetQuat, nodeConstraint.weight);
      nodeConstraint.destination.rotationLocal = targetQuat;
    }
    _updateSpringBones(dt) {
      this._sphereColliders.forEach(({ object, shape, cache }) => {
        const offset2 = vec3_exports.copy(cache.head, shape.offset);
        object.transformVectorWorld(offset2);
        vec3_exports.add(cache.head, object.getTranslationWorld(this._tempV3), offset2);
      });
      this._capsuleColliders.forEach(({ object, shape, cache }) => {
        const shapeCenter = object.getTranslationWorld(this._tempV3A);
        const headOffset = vec3_exports.copy(cache.head, shape.offset);
        object.transformVectorWorld(headOffset);
        vec3_exports.add(cache.head, shapeCenter, headOffset);
        const tailOffset = vec3_exports.copy(cache.tail, shape.tail);
        object.transformVectorWorld(tailOffset);
        vec3_exports.add(cache.tail, shapeCenter, tailOffset);
      });
      this._springChains.forEach((springChain) => {
        for (let i = 0; i < springChain.joints.length - 1; ++i) {
          const joint = springChain.joints[i];
          const parentWorldRotation = joint.node.parent ? joint.node.parent.rotationWorld : this._identityQuat;
          const inertia = this._inertia;
          if (springChain.center) {
            vec3_exports.sub(inertia, joint.state.currentTailCenter, joint.state.prevTailCenter);
            springChain.center.transformVectorWorld(inertia);
          } else {
            vec3_exports.sub(inertia, joint.state.currentTail, joint.state.prevTail);
          }
          vec3_exports.scale(inertia, inertia, 1 - joint.dragForce);
          const stiffness = vec3_exports.copy(this._stiffness, joint.state.boneAxis);
          vec3_exports.transformQuat(stiffness, stiffness, joint.state.initialLocalRotation);
          vec3_exports.transformQuat(stiffness, stiffness, parentWorldRotation);
          vec3_exports.scale(stiffness, stiffness, dt * joint.stiffness);
          const external = vec3_exports.scale(this._external, joint.gravityDir, dt * joint.gravityPower);
          const nextTail = vec3_exports.copy(this._tempV3A, joint.state.currentTail);
          vec3_exports.add(nextTail, nextTail, inertia);
          vec3_exports.add(nextTail, nextTail, stiffness);
          vec3_exports.add(nextTail, nextTail, external);
          const worldPosition = joint.node.getTranslationWorld(this._tempV3B);
          vec3_exports.sub(nextTail, nextTail, worldPosition);
          vec3_exports.normalize(nextTail, nextTail);
          vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
          for (const { shape, cache } of springChain.sphereColliders) {
            let tailToShape = this._tailToShape;
            const sphereCenter = cache.head;
            tailToShape = vec3_exports.sub(tailToShape, nextTail, sphereCenter);
            const radius = shape.radius + joint.hitRadius;
            const dist2 = vec3_exports.length(tailToShape) - radius;
            if (dist2 < 0) {
              vec3_exports.normalize(tailToShape, tailToShape);
              vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist2);
              vec3_exports.sub(nextTail, nextTail, worldPosition);
              vec3_exports.normalize(nextTail, nextTail);
              vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
            }
          }
          for (const { shape, cache } of springChain.capsuleColliders) {
            let tailToShape = this._tailToShape;
            const head = cache.head;
            const tail = cache.tail;
            tailToShape = vec3_exports.sub(tailToShape, nextTail, head);
            const headToTail = vec3_exports.sub(this._headToTail, tail, head);
            const dot5 = vec3_exports.dot(headToTail, tailToShape);
            if (vec3_exports.squaredLength(headToTail) <= dot5) {
              vec3_exports.sub(tailToShape, nextTail, tail);
            } else if (dot5 > 0) {
              vec3_exports.scale(headToTail, headToTail, dot5 / vec3_exports.squaredLength(headToTail));
              vec3_exports.sub(tailToShape, tailToShape, headToTail);
            }
            const radius = shape.radius + joint.hitRadius;
            const dist2 = vec3_exports.length(tailToShape) - radius;
            if (dist2 < 0) {
              vec3_exports.normalize(tailToShape, tailToShape);
              vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist2);
              vec3_exports.sub(nextTail, nextTail, worldPosition);
              vec3_exports.normalize(nextTail, nextTail);
              vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
            }
          }
          vec3_exports.copy(joint.state.prevTail, joint.state.currentTail);
          vec3_exports.copy(joint.state.currentTail, nextTail);
          if (springChain.center) {
            vec3_exports.copy(joint.state.prevTailCenter, joint.state.currentTailCenter);
            vec3_exports.copy(joint.state.currentTailCenter, nextTail);
            springChain.center.transformPointInverseWorld(joint.state.currentTailCenter);
          }
          joint.node.parent.transformPointInverseWorld(nextTail);
          const nextTailDualQuat = quat2_exports.fromTranslation(this._tempQuat2, nextTail);
          quat2_exports.multiply(nextTailDualQuat, joint.state.initialLocalTransformInvert, nextTailDualQuat);
          quat2_exports.getTranslation(nextTail, nextTailDualQuat);
          vec3_exports.normalize(nextTail, nextTail);
          const jointRotation = quat_exports.rotationTo(this._tempQuatA, joint.state.boneAxis, nextTail);
          joint.node.rotationLocal = quat_exports.mul(this._tempQuatA, joint.state.initialLocalRotation, jointRotation);
        }
      });
    }
    /**
     * @param {boolean} firstPerson Whether the model should render for first person or third person views
     */
    set firstPerson(firstPerson) {
      this._firstPersonAnnotations.forEach((annotation) => {
        const visible = firstPerson == annotation.firstPerson || firstPerson != annotation.thirdPerson;
        annotation.node.getComponents("mesh").forEach((mesh) => {
          mesh.active = visible;
        });
      });
    }
  };
  __publicField(Vrm, "TypeName", "vrm");
  __publicField(Vrm, "Properties", {
    /** URL to a VRM file to load */
    src: { type: Type.String },
    /** Object the VRM is looking at */
    lookAtTarget: { type: Type.Object }
  });

  // node_modules/@wonderlandengine/components/dist/wasd-controls.js
  var _direction = new Float32Array(3);
  var WasdControlsComponent = class extends Component3 {
    init() {
      this.up = false;
      this.right = false;
      this.down = false;
      this.left = false;
      window.addEventListener("keydown", this.press.bind(this));
      window.addEventListener("keyup", this.release.bind(this));
    }
    start() {
      this.headObject = this.headObject || this.object;
    }
    update() {
      vec3_exports.zero(_direction);
      if (this.up)
        _direction[2] -= 1;
      if (this.down)
        _direction[2] += 1;
      if (this.left)
        _direction[0] -= 1;
      if (this.right)
        _direction[0] += 1;
      vec3_exports.normalize(_direction, _direction);
      _direction[0] *= this.speed;
      _direction[2] *= this.speed;
      vec3_exports.transformQuat(_direction, _direction, this.headObject.transformWorld);
      if (this.lockY) {
        _direction[1] = 0;
        vec3_exports.normalize(_direction, _direction);
        vec3_exports.scale(_direction, _direction, this.speed);
      }
      this.object.translateLocal(_direction);
    }
    press(e) {
      if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
        this.up = true;
      } else if (e.keyCode === 39 || e.keyCode === 68) {
        this.right = true;
      } else if (e.keyCode === 40 || e.keyCode === 83) {
        this.down = true;
      } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
        this.left = true;
      }
    }
    release(e) {
      if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
        this.up = false;
      } else if (e.keyCode === 39 || e.keyCode === 68) {
        this.right = false;
      } else if (e.keyCode === 40 || e.keyCode === 83) {
        this.down = false;
      } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
        this.left = false;
      }
    }
  };
  __publicField(WasdControlsComponent, "TypeName", "wasd-controls");
  __publicField(WasdControlsComponent, "Properties", {
    /** Movement speed in m/s. */
    speed: { type: Type.Float, default: 0.1 },
    /** Flag for only moving the object on the global x & z planes */
    lockY: { type: Type.Bool, default: false },
    /** Object of which the orientation is used to determine forward direction */
    headObject: { type: Type.Object }
  });

  // node_modules/@wonderlandengine/components/dist/input-profile.js
  var __decorate10 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var _tempVec = vec3_exports.create();
  var _tempQuat = quat_exports.create();
  var _tempRotation1 = new Float32Array(4);
  var _tempRotation2 = new Float32Array(4);
  var minTemp = new Float32Array(3);
  var maxTemp = new Float32Array(3);
  var hands = ["left", "right"];
  var _InputProfile = class extends Component3 {
    _gamepadObjects = {};
    _controllerModel = null;
    _defaultControllerComponents;
    _handedness;
    _profileJSON = null;
    _buttons = [];
    _axes = [];
    /**
     * The XR gamepad associated with the current input source.
     */
    gamepad;
    /**
     * A reference to the emitter which triggered on model lodaed event.
     */
    onModelLoaded = new Emitter();
    /**
     * Returns url of input profile json file
     */
    url;
    /**
     * A set of components to filter during component retrieval.
     */
    toFilter = /* @__PURE__ */ new Set(["vr-mode-active-mode-switch"]);
    /**
     * The index representing the handedness of the controller (0 for left, 1 for right).
     */
    handedness = 0;
    /**
     * The base path where XR input profiles are stored.
     */
    defaultBasePath;
    /**
     * An optional folder path for loading custom XR input profiles.
     */
    customBasePath;
    /**
     * The default 3D controller model used when a custom model fails to load.
     */
    defaultController;
    /**
     * The object which has HandTracking component added to it.
     */
    trackedHand;
    /**
     * If true, the input profile will be mapped to the default controller, and no dynamic 3D model of controller will be loaded.
     */
    mapToDefaultController;
    /**
     * If true, adds a VR mode switch component to the loaded controller model.
     */
    addVrModeSwitch;
    onActivate() {
      this._handedness = hands[this.handedness];
      const defaultHandName = "Hand" + this._handedness.charAt(0).toUpperCase() + this._handedness.slice(1);
      this.trackedHand = this.trackedHand ?? this.object.parent?.findByNameRecursive(defaultHandName)[0];
      this.defaultController = this.defaultController || this.object.children[0];
      this._defaultControllerComponents = this._getComponents(this.defaultController);
      this.engine.onXRSessionStart.add(() => {
        this.engine.xr?.session.addEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
      });
    }
    onDeactivate() {
      this.engine.xr?.session?.removeEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
    }
    /**
     * Sets newly loaded controllers for the HandTracking component to proper switching.
     * @param controllerObject The controller object.
     * @hidden
     */
    _setHandTrackingControllers(controllerObject) {
      const handtrackingComponent = this.trackedHand.getComponent(HandTracking);
      if (!handtrackingComponent)
        return;
      handtrackingComponent.controllerToDeactivate = controllerObject;
    }
    /**
     * Retrieves all components from the specified object and its children.
     * @param obj The object to retrieve components from.
     * @return An array of components.
     * @hidden
     */
    _getComponents(obj) {
      const components = [];
      if (obj == null)
        return components;
      const stack = [obj];
      while (stack.length > 0) {
        const currentObj = stack.pop();
        const comps = currentObj.getComponents().filter((c) => !this.toFilter.has(c.type));
        components.push(...comps);
        const children = currentObj.children;
        for (let i = children.length - 1; i >= 0; --i) {
          stack.push(children[i]);
        }
      }
      return components;
    }
    /**
     * Activates or deactivates components based on the specified boolean value.
     * @param active If true, components are set to active; otherwise, they are set to inactive.
     * @hidden
     */
    _setComponentsActive(active) {
      const comps = this._defaultControllerComponents;
      if (comps == void 0)
        return;
      for (let i = 0; i < comps.length; ++i) {
        comps[i].active = active;
      }
    }
    /**
     * Event handler triggered when XR input sources change.
     * Detects new XR input sources and initiates the loading of input profiles.
     * @param event The XR input source change event.
     * @hidden
     */
    _onInputSourcesChange(event) {
      if (this._isModelLoaded() && !this.mapToDefaultController) {
        this._setComponentsActive(false);
      }
      event.added.forEach((xrInputSource) => {
        if (xrInputSource.hand != null)
          return;
        if (this._handedness != xrInputSource.handedness)
          return;
        this.gamepad = xrInputSource.gamepad;
        const profile = this.customBasePath !== "" ? this.customBasePath : this.defaultBasePath + xrInputSource.profiles[0];
        this.url = profile + "/profile.json";
        this._profileJSON = _InputProfile.Cache.get(this.url) ?? null;
        if (this._profileJSON != null)
          return;
        fetch(this.url).then((res) => res.json()).then((out) => {
          this._profileJSON = out;
          _InputProfile.Cache.set(this.url, this._profileJSON);
          if (!this._isModelLoaded())
            this._loadAndMapGamepad(profile);
        }).catch((e) => {
          console.error(`Failed to load profile from ${this.url}. Reason:`, e);
        });
      });
    }
    /**
     * Checks if the 3D controller model is loaded.
     * @return True if the model is loaded; otherwise, false.
     * @hidden
     */
    _isModelLoaded() {
      return this._controllerModel !== null;
    }
    /**
     * Loads the 3D controller model and caches the mapping to the gamepad.
     * @param profile The path to the input profile.
     * @hidden
     */
    async _loadAndMapGamepad(profile) {
      const assetPath = profile + "/" + this._handedness + ".glb";
      this._controllerModel = this.defaultController;
      if (!this.mapToDefaultController) {
        try {
          this._controllerModel = await this.engine.scene.append(assetPath);
        } catch (e) {
          console.error(`Failed to load i-p controller model. Reason:`, e, `Continuing with ${this._handedness} default controller.`);
          this._setComponentsActive(true);
        }
        this._controllerModel.parent = this.object;
        this._controllerModel.setPositionLocal([0, 0, 0]);
        this._setComponentsActive(false);
        if (this.addVrModeSwitch)
          this._controllerModel.addComponent(VrModeActiveSwitch);
        this.onModelLoaded.notify();
      }
      this._cacheGamepadObjectsFromProfile(this._profileJSON, this._controllerModel);
      this._setHandTrackingControllers(this._controllerModel);
      this.update = () => this._mapGamepadInput();
    }
    /**
     * Caches gamepad objects (buttons, axes) from the loaded input profile.
     * @hidden
     */
    _cacheGamepadObjectsFromProfile(profile, obj) {
      const components = profile.layouts[this._handedness].components;
      if (!components)
        return;
      this._buttons = [];
      this._axes = [];
      for (const i in components) {
        const visualResponses = components[i].visualResponses;
        for (const j in visualResponses) {
          const visualResponse = visualResponses[j];
          const valueNode = visualResponse.valueNodeName;
          const minNode = visualResponse.minNodeName;
          const maxNode = visualResponse.maxNodeName;
          this._gamepadObjects[valueNode] = obj.findByNameRecursive(valueNode)[0];
          this._gamepadObjects[minNode] = obj.findByNameRecursive(minNode)[0];
          this._gamepadObjects[maxNode] = obj.findByNameRecursive(maxNode)[0];
          const indice = visualResponses[j].componentProperty;
          const response = {
            target: this._gamepadObjects[valueNode],
            min: this._gamepadObjects[minNode],
            max: this._gamepadObjects[maxNode],
            id: components[i].gamepadIndices[indice]
            // Assign a unique ID
          };
          switch (indice) {
            case "button":
              this._buttons.push(response);
              break;
            case "xAxis":
            case "yAxis":
              this._axes.push(response);
              break;
          }
        }
      }
    }
    /**
     * Assigns a transformed position and rotation to the target based on minimum and maximum values and a normalized input value.
     * @param target The target object to be transformed.
     * @param min The minimum object providing transformation limits.
     * @param max The maximum object providing transformation limits.
     * @param value The normalized input value.
     * @hidden
     */
    _assignTransform(target, min2, max2, value) {
      vec3_exports.lerp(_tempVec, min2.getPositionWorld(minTemp), max2.getPositionWorld(maxTemp), value);
      target.setPositionWorld(_tempVec);
      quat_exports.lerp(_tempQuat, min2.getRotationWorld(_tempRotation1), max2.getRotationWorld(_tempRotation2), value);
      quat_exports.normalize(_tempQuat, _tempQuat);
      target.setRotationWorld(_tempQuat);
    }
    /**
     * Maps input values (buttons, axes) to the 3D controller model.
     * @hidden
     */
    _mapGamepadInput() {
      for (const button of this._buttons) {
        const buttonValue = this.gamepad.buttons[button.id].value;
        this._assignTransform(button.target, button.min, button.max, buttonValue);
      }
      for (const axis of this._axes) {
        const axisValue = this.gamepad.axes[axis.id];
        const normalizedAxisValue = (axisValue + 1) / 2;
        this._assignTransform(axis.target, axis.min, axis.max, normalizedAxisValue);
      }
    }
  };
  var InputProfile = _InputProfile;
  __publicField(InputProfile, "TypeName", "input-profile");
  /**
   * A cache to store loaded profiles for reuse.
   */
  __publicField(InputProfile, "Cache", /* @__PURE__ */ new Map());
  __decorate10([
    property.enum(hands, 0)
  ], InputProfile.prototype, "handedness", void 0);
  __decorate10([
    property.string("https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@latest/dist/profiles/")
  ], InputProfile.prototype, "defaultBasePath", void 0);
  __decorate10([
    property.string()
  ], InputProfile.prototype, "customBasePath", void 0);
  __decorate10([
    property.object()
  ], InputProfile.prototype, "defaultController", void 0);
  __decorate10([
    property.object()
  ], InputProfile.prototype, "trackedHand", void 0);
  __decorate10([
    property.bool(false)
  ], InputProfile.prototype, "mapToDefaultController", void 0);
  __decorate10([
    property.bool(true)
  ], InputProfile.prototype, "addVrModeSwitch", void 0);

  // node_modules/@wonderlandengine/components/dist/orbital-camera.js
  var __decorate11 = function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var preventDefault2 = (e) => {
    e.preventDefault();
  };
  var tempVec4 = [0, 0, 0];
  var tempquat = quat_exports.create();
  var tempquat2 = quat_exports.create();
  var tempVec33 = vec3_exports.create();
  var OrbitalCamera = class extends Component3 {
    mouseButtonIndex = 0;
    radial = 5;
    minElevation = 0;
    maxElevation = 89.99;
    minZoom = 0.01;
    maxZoom = 10;
    xSensitivity = 0.5;
    ySensitivity = 0.5;
    zoomSensitivity = 0.02;
    damping = 0.9;
    _mouseDown = false;
    _origin = [0, 0, 0];
    _azimuth = 0;
    _polar = 45;
    _initialPinchDistance = 0;
    _touchStartX = 0;
    _touchStartY = 0;
    _azimuthSpeed = 0;
    _polarSpeed = 0;
    init() {
      this.object.getPositionWorld(this._origin);
    }
    start() {
      this._updateCamera();
    }
    onActivate() {
      const canvas2 = this.engine.canvas;
      canvas2.addEventListener("mousemove", this._onMouseMove);
      if (this.mouseButtonIndex === 2) {
        canvas2.addEventListener("contextmenu", preventDefault2, { passive: false });
      }
      canvas2.addEventListener("mousedown", this._onMouseDown);
      canvas2.addEventListener("mouseup", this._onMouseUp);
      canvas2.addEventListener("wheel", this._onMouseScroll, { passive: false });
      canvas2.addEventListener("touchstart", this._onTouchStart, { passive: false });
      canvas2.addEventListener("touchmove", this._onTouchMove, { passive: false });
      canvas2.addEventListener("touchend", this._onTouchEnd);
    }
    onDeactivate() {
      const canvas2 = this.engine.canvas;
      canvas2.removeEventListener("mousemove", this._onMouseMove);
      if (this.mouseButtonIndex === 2) {
        canvas2.removeEventListener("contextmenu", preventDefault2);
      }
      canvas2.removeEventListener("mousedown", this._onMouseDown);
      canvas2.removeEventListener("mouseup", this._onMouseUp);
      canvas2.removeEventListener("wheel", this._onMouseScroll);
      canvas2.removeEventListener("touchstart", this._onTouchStart);
      canvas2.removeEventListener("touchmove", this._onTouchMove);
      canvas2.removeEventListener("touchend", this._onTouchEnd);
      this._mouseDown = false;
      this._initialPinchDistance = 0;
      this._touchStartX = 0;
      this._touchStartY = 0;
      this._azimuthSpeed = 0;
      this._polarSpeed = 0;
    }
    update() {
      this._azimuthSpeed *= this.damping;
      this._polarSpeed *= this.damping;
      if (Math.abs(this._azimuthSpeed) < 0.01)
        this._azimuthSpeed = 0;
      if (Math.abs(this._polarSpeed) < 0.01)
        this._polarSpeed = 0;
      this._azimuth += this._azimuthSpeed;
      this._polar += this._polarSpeed;
      this._polar = Math.min(this.maxElevation, Math.max(this.minElevation, this._polar));
      if (this._azimuthSpeed !== 0 || this._polarSpeed !== 0) {
        this._updateCamera();
      }
    }
    /**
     * Get the closest position to the given position on the orbit sphere of the camera.
     * This can be used to get a position and rotation to transition to.
     *
     * You pass this a position object. The method calculates the closest positition and updates the position parameter.
     * It also sets the rotation parameter to reflect the rotate the camera will have when it is on the orbit sphere,
     * pointing towards the center.
     * @param position the position to get the closest position to
     * @param rotation the rotation to get the closest position to
     */
    getClosestPosition(position, rotation) {
      this.object.getRotationWorld(tempquat);
      this.object.lookAt(this._origin);
      this.object.getRotationWorld(tempquat2);
      if (quat_exports.dot(tempquat, tempquat2) < 0) {
        quat_exports.scale(tempquat2, tempquat2, -1);
      }
      this.object.setRotationWorld(tempquat);
      const directionToCamera = vec3_exports.create();
      vec3_exports.subtract(directionToCamera, position, this._origin);
      vec3_exports.normalize(directionToCamera, directionToCamera);
      const nearestPointOnSphere = vec3_exports.create();
      vec3_exports.scale(nearestPointOnSphere, directionToCamera, this.radial);
      vec3_exports.add(nearestPointOnSphere, nearestPointOnSphere, this._origin);
      vec3_exports.copy(position, nearestPointOnSphere);
      quat_exports.copy(rotation, tempquat2);
    }
    /**
     * Set the camera position based on the given position and calculate the rotation.
     * @param cameraPosition the position to set the camera to
     */
    setPosition(cameraPosition) {
      const centerOfOrbit = this._origin;
      vec3_exports.subtract(tempVec33, cameraPosition, centerOfOrbit);
      vec3_exports.normalize(tempVec33, tempVec33);
      const azimuth = Math.atan2(tempVec33[0], tempVec33[2]);
      const polar = Math.acos(tempVec33[1]);
      const azimuthDeg = rad2deg(azimuth);
      const polarDeg = 90 - rad2deg(polar);
      this._azimuth = azimuthDeg;
      this._polar = polarDeg;
    }
    /**
     * Update the camera position based on the current azimuth,
     * polar and radial values
     */
    _updateCamera() {
      const azimuthInRadians = deg2rad(this._azimuth);
      const polarInRadians = deg2rad(this._polar);
      tempVec4[0] = this.radial * Math.sin(azimuthInRadians) * Math.cos(polarInRadians);
      tempVec4[1] = this.radial * Math.sin(polarInRadians);
      tempVec4[2] = this.radial * Math.cos(azimuthInRadians) * Math.cos(polarInRadians);
      this.object.setPositionWorld(tempVec4);
      this.object.translateWorld(this._origin);
      this.object.lookAt(this._origin);
    }
    /* Mouse Event Handlers */
    _onMouseDown = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this._mouseDown = true;
        document.body.style.cursor = "grabbing";
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      }
    };
    _onMouseUp = (e) => {
      if (e.button === this.mouseButtonIndex) {
        this._mouseDown = false;
        document.body.style.cursor = "initial";
      }
    };
    _onMouseMove = (e) => {
      if (this.active && this._mouseDown) {
        if (this.active && this._mouseDown) {
          this._azimuthSpeed = -(e.movementX * this.xSensitivity);
          this._polarSpeed = e.movementY * this.ySensitivity;
        }
      }
    };
    _onMouseScroll = (e) => {
      e.preventDefault();
      this.radial *= 1 - e.deltaY * this.zoomSensitivity * -1e-3;
      this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
      this._updateCamera();
    };
    /* Touch event handlers */
    _onTouchStart = (e) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
        this._mouseDown = true;
      } else if (e.touches.length === 2) {
        this._initialPinchDistance = this._getDistanceBetweenTouches(e.touches);
        e.preventDefault();
      }
    };
    _onTouchMove = (e) => {
      if (!this.active || !this._mouseDown) {
        return;
      }
      e.preventDefault();
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this._touchStartX;
        const deltaY = e.touches[0].clientY - this._touchStartY;
        this._azimuthSpeed = -(deltaX * this.xSensitivity);
        this._polarSpeed = deltaY * this.ySensitivity;
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const currentPinchDistance = this._getDistanceBetweenTouches(e.touches);
        const pinchScale = this._initialPinchDistance / currentPinchDistance;
        this.radial *= pinchScale;
        this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
        this._updateCamera();
        this._initialPinchDistance = currentPinchDistance;
      }
    };
    _onTouchEnd = (e) => {
      if (e.touches.length < 2) {
        this._mouseDown = false;
      }
      if (e.touches.length === 1) {
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
      }
    };
    /**
     * Helper function to calculate the distance between two touch points
     * @param touches list of touch points
     * @returns distance between the two touch points
     */
    _getDistanceBetweenTouches(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };
  __publicField(OrbitalCamera, "TypeName", "orbital-camera");
  __decorate11([
    property.int()
  ], OrbitalCamera.prototype, "mouseButtonIndex", void 0);
  __decorate11([
    property.float(5)
  ], OrbitalCamera.prototype, "radial", void 0);
  __decorate11([
    property.float()
  ], OrbitalCamera.prototype, "minElevation", void 0);
  __decorate11([
    property.float(89.99)
  ], OrbitalCamera.prototype, "maxElevation", void 0);
  __decorate11([
    property.float()
  ], OrbitalCamera.prototype, "minZoom", void 0);
  __decorate11([
    property.float(10)
  ], OrbitalCamera.prototype, "maxZoom", void 0);
  __decorate11([
    property.float(0.5)
  ], OrbitalCamera.prototype, "xSensitivity", void 0);
  __decorate11([
    property.float(0.5)
  ], OrbitalCamera.prototype, "ySensitivity", void 0);
  __decorate11([
    property.float(0.02)
  ], OrbitalCamera.prototype, "zoomSensitivity", void 0);
  __decorate11([
    property.float(0.9)
  ], OrbitalCamera.prototype, "damping", void 0);

  // node_modules/@zestymarket/wonderland-sdk/dist/zesty-wonderland-sdk.js
  var zesty_wonderland_sdk_exports = {};
  __export(zesty_wonderland_sdk_exports, {
    ZestyBanner: () => J
  });
  var Yt = Object.create;
  var X = Object.defineProperty;
  var Zt = Object.getOwnPropertyDescriptor;
  var er = Object.getOwnPropertyNames;
  var tr = Object.getPrototypeOf;
  var rr = Object.prototype.hasOwnProperty;
  var nr = (t, e, r) => e in t ? X(t, e, { enumerable: true, configurable: true, writable: true, value: r }) : t[e] = r;
  var l = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
  var ir = (t, e, r, i) => {
    if (e && typeof e == "object" || typeof e == "function")
      for (let n of er(e))
        !rr.call(t, n) && n !== r && X(t, n, { get: () => e[n], enumerable: !(i = Zt(e, n)) || i.enumerable });
    return t;
  };
  var Ae = (t, e, r) => (r = t != null ? Yt(tr(t)) : {}, ir(e || !t || !t.__esModule ? X(r, "default", { value: t, enumerable: true }) : r, t));
  var G = (t, e, r) => (nr(t, typeof e != "symbol" ? e + "" : e, r), r);
  var Q = l((vn, qe) => {
    "use strict";
    qe.exports = function(e, r) {
      return function() {
        for (var n = new Array(arguments.length), s = 0; s < n.length; s++)
          n[s] = arguments[s];
        return e.apply(r, n);
      };
    };
  });
  var f = l((wn, Ne) => {
    "use strict";
    var sr = Q(), Z = Object.prototype.toString, ee = function(t) {
      return function(e) {
        var r = Z.call(e);
        return t[r] || (t[r] = r.slice(8, -1).toLowerCase());
      };
    }(/* @__PURE__ */ Object.create(null));
    function A(t) {
      return t = t.toLowerCase(), function(r) {
        return ee(r) === t;
      };
    }
    function te(t) {
      return Array.isArray(t);
    }
    function F(t) {
      return typeof t > "u";
    }
    function ar(t) {
      return t !== null && !F(t) && t.constructor !== null && !F(t.constructor) && typeof t.constructor.isBuffer == "function" && t.constructor.isBuffer(t);
    }
    var Te = A("ArrayBuffer");
    function or(t) {
      var e;
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(t) : e = t && t.buffer && Te(t.buffer), e;
    }
    function ur(t) {
      return typeof t == "string";
    }
    function cr(t) {
      return typeof t == "number";
    }
    function Se(t) {
      return t !== null && typeof t == "object";
    }
    function j(t) {
      if (ee(t) !== "object")
        return false;
      var e = Object.getPrototypeOf(t);
      return e === null || e === Object.prototype;
    }
    var lr = A("Date"), dr = A("File"), fr = A("Blob"), pr = A("FileList");
    function re(t) {
      return Z.call(t) === "[object Function]";
    }
    function hr(t) {
      return Se(t) && re(t.pipe);
    }
    function mr(t) {
      var e = "[object FormData]";
      return t && (typeof FormData == "function" && t instanceof FormData || Z.call(t) === e || re(t.toString) && t.toString() === e);
    }
    var yr = A("URLSearchParams");
    function vr(t) {
      return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
    }
    function wr() {
      return typeof navigator < "u" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS") ? false : typeof window < "u" && typeof document < "u";
    }
    function ne(t, e) {
      if (!(t === null || typeof t > "u"))
        if (typeof t != "object" && (t = [t]), te(t))
          for (var r = 0, i = t.length; r < i; r++)
            e.call(null, t[r], r, t);
        else
          for (var n in t)
            Object.prototype.hasOwnProperty.call(t, n) && e.call(null, t[n], n, t);
    }
    function Y() {
      var t = {};
      function e(n, s) {
        j(t[s]) && j(n) ? t[s] = Y(t[s], n) : j(n) ? t[s] = Y({}, n) : te(n) ? t[s] = n.slice() : t[s] = n;
      }
      for (var r = 0, i = arguments.length; r < i; r++)
        ne(arguments[r], e);
      return t;
    }
    function gr(t, e, r) {
      return ne(e, function(n, s) {
        r && typeof n == "function" ? t[s] = sr(n, r) : t[s] = n;
      }), t;
    }
    function br(t) {
      return t.charCodeAt(0) === 65279 && (t = t.slice(1)), t;
    }
    function Er(t, e, r, i) {
      t.prototype = Object.create(e.prototype, i), t.prototype.constructor = t, r && Object.assign(t.prototype, r);
    }
    function xr(t, e, r) {
      var i, n, s, a = {};
      e = e || {};
      do {
        for (i = Object.getOwnPropertyNames(t), n = i.length; n-- > 0; )
          s = i[n], a[s] || (e[s] = t[s], a[s] = true);
        t = Object.getPrototypeOf(t);
      } while (t && (!r || r(t, e)) && t !== Object.prototype);
      return e;
    }
    function Cr(t, e, r) {
      t = String(t), (r === void 0 || r > t.length) && (r = t.length), r -= e.length;
      var i = t.indexOf(e, r);
      return i !== -1 && i === r;
    }
    function Rr(t) {
      if (!t)
        return null;
      var e = t.length;
      if (F(e))
        return null;
      for (var r = new Array(e); e-- > 0; )
        r[e] = t[e];
      return r;
    }
    var Or = function(t) {
      return function(e) {
        return t && e instanceof t;
      };
    }(typeof Uint8Array < "u" && Object.getPrototypeOf(Uint8Array));
    Ne.exports = { isArray: te, isArrayBuffer: Te, isBuffer: ar, isFormData: mr, isArrayBufferView: or, isString: ur, isNumber: cr, isObject: Se, isPlainObject: j, isUndefined: F, isDate: lr, isFile: dr, isBlob: fr, isFunction: re, isStream: hr, isURLSearchParams: yr, isStandardBrowserEnv: wr, forEach: ne, merge: Y, extend: gr, trim: vr, stripBOM: br, inherits: Er, toFlatObject: xr, kindOf: ee, kindOfTest: A, endsWith: Cr, toArray: Rr, isTypedArray: Or, isFileList: pr };
  });
  var ie = l((gn, Pe) => {
    "use strict";
    var S = f();
    function ke(t) {
      return encodeURIComponent(t).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    Pe.exports = function(e, r, i) {
      if (!r)
        return e;
      var n;
      if (i)
        n = i(r);
      else if (S.isURLSearchParams(r))
        n = r.toString();
      else {
        var s = [];
        S.forEach(r, function(c, h) {
          c === null || typeof c > "u" || (S.isArray(c) ? h = h + "[]" : c = [c], S.forEach(c, function(d) {
            S.isDate(d) ? d = d.toISOString() : S.isObject(d) && (d = JSON.stringify(d)), s.push(ke(h) + "=" + ke(d));
          }));
        }), n = s.join("&");
      }
      if (n) {
        var a = e.indexOf("#");
        a !== -1 && (e = e.slice(0, a)), e += (e.indexOf("?") === -1 ? "?" : "&") + n;
      }
      return e;
    };
  });
  var De = l((bn, _e) => {
    "use strict";
    var Ar = f();
    function I() {
      this.handlers = [];
    }
    I.prototype.use = function(e, r, i) {
      return this.handlers.push({ fulfilled: e, rejected: r, synchronous: i ? i.synchronous : false, runWhen: i ? i.runWhen : null }), this.handlers.length - 1;
    };
    I.prototype.eject = function(e) {
      this.handlers[e] && (this.handlers[e] = null);
    };
    I.prototype.forEach = function(e) {
      Ar.forEach(this.handlers, function(i) {
        i !== null && e(i);
      });
    };
    _e.exports = I;
  });
  var Be = l((En, Ue) => {
    "use strict";
    var qr = f();
    Ue.exports = function(e, r) {
      qr.forEach(e, function(n, s) {
        s !== r && s.toUpperCase() === r.toUpperCase() && (e[r] = n, delete e[s]);
      });
    };
  });
  var q = l((xn, Ie) => {
    "use strict";
    var Le = f();
    function N(t, e, r, i, n) {
      Error.call(this), this.message = t, this.name = "AxiosError", e && (this.code = e), r && (this.config = r), i && (this.request = i), n && (this.response = n);
    }
    Le.inherits(N, Error, { toJSON: function() {
      return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code, status: this.response && this.response.status ? this.response.status : null };
    } });
    var je = N.prototype, Fe = {};
    ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED"].forEach(function(t) {
      Fe[t] = { value: t };
    });
    Object.defineProperties(N, Fe);
    Object.defineProperty(je, "isAxiosError", { value: true });
    N.from = function(t, e, r, i, n, s) {
      var a = Object.create(je);
      return Le.toFlatObject(t, a, function(c) {
        return c !== Error.prototype;
      }), N.call(a, t.message, e, r, i, n), a.name = t.name, s && Object.assign(a, s), a;
    };
    Ie.exports = N;
  });
  var se = l((Cn, ze) => {
    "use strict";
    ze.exports = { silentJSONParsing: true, forcedJSONParsing: true, clarifyTimeoutError: false };
  });
  var ae = l((Rn, Me) => {
    "use strict";
    var b = f();
    function Tr(t, e) {
      e = e || new FormData();
      var r = [];
      function i(s) {
        return s === null ? "" : b.isDate(s) ? s.toISOString() : b.isArrayBuffer(s) || b.isTypedArray(s) ? typeof Blob == "function" ? new Blob([s]) : Buffer.from(s) : s;
      }
      function n(s, a) {
        if (b.isPlainObject(s) || b.isArray(s)) {
          if (r.indexOf(s) !== -1)
            throw Error("Circular reference detected in " + a);
          r.push(s), b.forEach(s, function(c, h) {
            if (!b.isUndefined(c)) {
              var o = a ? a + "." + h : h, d;
              if (c && !a && typeof c == "object") {
                if (b.endsWith(h, "{}"))
                  c = JSON.stringify(c);
                else if (b.endsWith(h, "[]") && (d = b.toArray(c))) {
                  d.forEach(function(v) {
                    !b.isUndefined(v) && e.append(o, i(v));
                  });
                  return;
                }
              }
              n(c, o);
            }
          }), r.pop();
        } else
          e.append(a, i(s));
      }
      return n(t), e;
    }
    Me.exports = Tr;
  });
  var He = l((On, $e) => {
    "use strict";
    var oe = q();
    $e.exports = function(e, r, i) {
      var n = i.config.validateStatus;
      !i.status || !n || n(i.status) ? e(i) : r(new oe("Request failed with status code " + i.status, [oe.ERR_BAD_REQUEST, oe.ERR_BAD_RESPONSE][Math.floor(i.status / 100) - 4], i.config, i.request, i));
    };
  });
  var Je = l((An, We) => {
    "use strict";
    var z = f();
    We.exports = z.isStandardBrowserEnv() ? function() {
      return { write: function(r, i, n, s, a, u) {
        var c = [];
        c.push(r + "=" + encodeURIComponent(i)), z.isNumber(n) && c.push("expires=" + new Date(n).toGMTString()), z.isString(s) && c.push("path=" + s), z.isString(a) && c.push("domain=" + a), u === true && c.push("secure"), document.cookie = c.join("; ");
      }, read: function(r) {
        var i = document.cookie.match(new RegExp("(^|;\\s*)(" + r + ")=([^;]*)"));
        return i ? decodeURIComponent(i[3]) : null;
      }, remove: function(r) {
        this.write(r, "", Date.now() - 864e5);
      } };
    }() : function() {
      return { write: function() {
      }, read: function() {
        return null;
      }, remove: function() {
      } };
    }();
  });
  var Ke = l((qn, Ve) => {
    "use strict";
    Ve.exports = function(e) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
    };
  });
  var Ge = l((Tn, Xe) => {
    "use strict";
    Xe.exports = function(e, r) {
      return r ? e.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : e;
    };
  });
  var ue = l((Sn, Qe) => {
    "use strict";
    var Sr = Ke(), Nr = Ge();
    Qe.exports = function(e, r) {
      return e && !Sr(r) ? Nr(e, r) : r;
    };
  });
  var Ze = l((Nn, Ye) => {
    "use strict";
    var ce = f(), kr = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
    Ye.exports = function(e) {
      var r = {}, i, n, s;
      return e && ce.forEach(e.split(`
`), function(u) {
        if (s = u.indexOf(":"), i = ce.trim(u.substr(0, s)).toLowerCase(), n = ce.trim(u.substr(s + 1)), i) {
          if (r[i] && kr.indexOf(i) >= 0)
            return;
          i === "set-cookie" ? r[i] = (r[i] ? r[i] : []).concat([n]) : r[i] = r[i] ? r[i] + ", " + n : n;
        }
      }), r;
    };
  });
  var rt = l((kn, tt) => {
    "use strict";
    var et = f();
    tt.exports = et.isStandardBrowserEnv() ? function() {
      var e = /(msie|trident)/i.test(navigator.userAgent), r = document.createElement("a"), i;
      function n(s) {
        var a = s;
        return e && (r.setAttribute("href", a), a = r.href), r.setAttribute("href", a), { href: r.href, protocol: r.protocol ? r.protocol.replace(/:$/, "") : "", host: r.host, search: r.search ? r.search.replace(/^\?/, "") : "", hash: r.hash ? r.hash.replace(/^#/, "") : "", hostname: r.hostname, port: r.port, pathname: r.pathname.charAt(0) === "/" ? r.pathname : "/" + r.pathname };
      }
      return i = n(window.location.href), function(a) {
        var u = et.isString(a) ? n(a) : a;
        return u.protocol === i.protocol && u.host === i.host;
      };
    }() : function() {
      return function() {
        return true;
      };
    }();
  });
  var U = l((Pn, it) => {
    "use strict";
    var le = q(), Pr = f();
    function nt(t) {
      le.call(this, t ?? "canceled", le.ERR_CANCELED), this.name = "CanceledError";
    }
    Pr.inherits(nt, le, { __CANCEL__: true });
    it.exports = nt;
  });
  var at = l((_n, st) => {
    "use strict";
    st.exports = function(e) {
      var r = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
      return r && r[1] || "";
    };
  });
  var de = l((Dn, ot) => {
    "use strict";
    var B = f(), _r = He(), Dr = Je(), Ur = ie(), Br = ue(), Lr = Ze(), jr = rt(), Fr = se(), x = q(), Ir = U(), zr = at();
    ot.exports = function(e) {
      return new Promise(function(i, n) {
        var s = e.data, a = e.headers, u = e.responseType, c;
        function h() {
          e.cancelToken && e.cancelToken.unsubscribe(c), e.signal && e.signal.removeEventListener("abort", c);
        }
        B.isFormData(s) && B.isStandardBrowserEnv() && delete a["Content-Type"];
        var o = new XMLHttpRequest();
        if (e.auth) {
          var d = e.auth.username || "", v = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
          a.Authorization = "Basic " + btoa(d + ":" + v);
        }
        var m = Br(e.baseURL, e.url);
        o.open(e.method.toUpperCase(), Ur(m, e.params, e.paramsSerializer), true), o.timeout = e.timeout;
        function Re() {
          if (o) {
            var g = "getAllResponseHeaders" in o ? Lr(o.getAllResponseHeaders()) : null, T = !u || u === "text" || u === "json" ? o.responseText : o.response, O = { data: T, status: o.status, statusText: o.statusText, headers: g, config: e, request: o };
            _r(function(K) {
              i(K), h();
            }, function(K) {
              n(K), h();
            }, O), o = null;
          }
        }
        if ("onloadend" in o ? o.onloadend = Re : o.onreadystatechange = function() {
          !o || o.readyState !== 4 || o.status === 0 && !(o.responseURL && o.responseURL.indexOf("file:") === 0) || setTimeout(Re);
        }, o.onabort = function() {
          o && (n(new x("Request aborted", x.ECONNABORTED, e, o)), o = null);
        }, o.onerror = function() {
          n(new x("Network Error", x.ERR_NETWORK, e, o, o)), o = null;
        }, o.ontimeout = function() {
          var T = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded", O = e.transitional || Fr;
          e.timeoutErrorMessage && (T = e.timeoutErrorMessage), n(new x(T, O.clarifyTimeoutError ? x.ETIMEDOUT : x.ECONNABORTED, e, o)), o = null;
        }, B.isStandardBrowserEnv()) {
          var Oe = (e.withCredentials || jr(m)) && e.xsrfCookieName ? Dr.read(e.xsrfCookieName) : void 0;
          Oe && (a[e.xsrfHeaderName] = Oe);
        }
        "setRequestHeader" in o && B.forEach(a, function(T, O) {
          typeof s > "u" && O.toLowerCase() === "content-type" ? delete a[O] : o.setRequestHeader(O, T);
        }), B.isUndefined(e.withCredentials) || (o.withCredentials = !!e.withCredentials), u && u !== "json" && (o.responseType = e.responseType), typeof e.onDownloadProgress == "function" && o.addEventListener("progress", e.onDownloadProgress), typeof e.onUploadProgress == "function" && o.upload && o.upload.addEventListener("progress", e.onUploadProgress), (e.cancelToken || e.signal) && (c = function(g) {
          o && (n(!g || g && g.type ? new Ir() : g), o.abort(), o = null);
        }, e.cancelToken && e.cancelToken.subscribe(c), e.signal && (e.signal.aborted ? c() : e.signal.addEventListener("abort", c))), s || (s = null);
        var V = zr(m);
        if (V && ["http", "https", "file"].indexOf(V) === -1) {
          n(new x("Unsupported protocol " + V + ":", x.ERR_BAD_REQUEST, e));
          return;
        }
        o.send(s);
      });
    };
  });
  var ct = l((Un, ut) => {
    ut.exports = null;
  });
  var $ = l((Bn, pt) => {
    "use strict";
    var p = f(), lt = Be(), dt = q(), Mr = se(), $r = ae(), Hr = { "Content-Type": "application/x-www-form-urlencoded" };
    function ft(t, e) {
      !p.isUndefined(t) && p.isUndefined(t["Content-Type"]) && (t["Content-Type"] = e);
    }
    function Wr() {
      var t;
      return typeof XMLHttpRequest < "u" ? t = de() : typeof process < "u" && Object.prototype.toString.call(process) === "[object process]" && (t = de()), t;
    }
    function Jr(t, e, r) {
      if (p.isString(t))
        try {
          return (e || JSON.parse)(t), p.trim(t);
        } catch (i) {
          if (i.name !== "SyntaxError")
            throw i;
        }
      return (r || JSON.stringify)(t);
    }
    var M = { transitional: Mr, adapter: Wr(), transformRequest: [function(e, r) {
      if (lt(r, "Accept"), lt(r, "Content-Type"), p.isFormData(e) || p.isArrayBuffer(e) || p.isBuffer(e) || p.isStream(e) || p.isFile(e) || p.isBlob(e))
        return e;
      if (p.isArrayBufferView(e))
        return e.buffer;
      if (p.isURLSearchParams(e))
        return ft(r, "application/x-www-form-urlencoded;charset=utf-8"), e.toString();
      var i = p.isObject(e), n = r && r["Content-Type"], s;
      if ((s = p.isFileList(e)) || i && n === "multipart/form-data") {
        var a = this.env && this.env.FormData;
        return $r(s ? { "files[]": e } : e, a && new a());
      } else if (i || n === "application/json")
        return ft(r, "application/json"), Jr(e);
      return e;
    }], transformResponse: [function(e) {
      var r = this.transitional || M.transitional, i = r && r.silentJSONParsing, n = r && r.forcedJSONParsing, s = !i && this.responseType === "json";
      if (s || n && p.isString(e) && e.length)
        try {
          return JSON.parse(e);
        } catch (a) {
          if (s)
            throw a.name === "SyntaxError" ? dt.from(a, dt.ERR_BAD_RESPONSE, this, null, this.response) : a;
        }
      return e;
    }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, env: { FormData: ct() }, validateStatus: function(e) {
      return e >= 200 && e < 300;
    }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
    p.forEach(["delete", "get", "head"], function(e) {
      M.headers[e] = {};
    });
    p.forEach(["post", "put", "patch"], function(e) {
      M.headers[e] = p.merge(Hr);
    });
    pt.exports = M;
  });
  var mt = l((Ln, ht) => {
    "use strict";
    var Vr = f(), Kr = $();
    ht.exports = function(e, r, i) {
      var n = this || Kr;
      return Vr.forEach(i, function(a) {
        e = a.call(n, e, r);
      }), e;
    };
  });
  var fe = l((jn, yt) => {
    "use strict";
    yt.exports = function(e) {
      return !!(e && e.__CANCEL__);
    };
  });
  var gt = l((Fn, wt) => {
    "use strict";
    var vt = f(), pe = mt(), Xr = fe(), Gr = $(), Qr = U();
    function he(t) {
      if (t.cancelToken && t.cancelToken.throwIfRequested(), t.signal && t.signal.aborted)
        throw new Qr();
    }
    wt.exports = function(e) {
      he(e), e.headers = e.headers || {}, e.data = pe.call(e, e.data, e.headers, e.transformRequest), e.headers = vt.merge(e.headers.common || {}, e.headers[e.method] || {}, e.headers), vt.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(n) {
        delete e.headers[n];
      });
      var r = e.adapter || Gr.adapter;
      return r(e).then(function(n) {
        return he(e), n.data = pe.call(e, n.data, n.headers, e.transformResponse), n;
      }, function(n) {
        return Xr(n) || (he(e), n && n.response && (n.response.data = pe.call(e, n.response.data, n.response.headers, e.transformResponse))), Promise.reject(n);
      });
    };
  });
  var me = l((In, bt) => {
    "use strict";
    var w = f();
    bt.exports = function(e, r) {
      r = r || {};
      var i = {};
      function n(o, d) {
        return w.isPlainObject(o) && w.isPlainObject(d) ? w.merge(o, d) : w.isPlainObject(d) ? w.merge({}, d) : w.isArray(d) ? d.slice() : d;
      }
      function s(o) {
        if (w.isUndefined(r[o])) {
          if (!w.isUndefined(e[o]))
            return n(void 0, e[o]);
        } else
          return n(e[o], r[o]);
      }
      function a(o) {
        if (!w.isUndefined(r[o]))
          return n(void 0, r[o]);
      }
      function u(o) {
        if (w.isUndefined(r[o])) {
          if (!w.isUndefined(e[o]))
            return n(void 0, e[o]);
        } else
          return n(void 0, r[o]);
      }
      function c(o) {
        if (o in r)
          return n(e[o], r[o]);
        if (o in e)
          return n(void 0, e[o]);
      }
      var h = { url: a, method: a, data: a, baseURL: u, transformRequest: u, transformResponse: u, paramsSerializer: u, timeout: u, timeoutMessage: u, withCredentials: u, adapter: u, responseType: u, xsrfCookieName: u, xsrfHeaderName: u, onUploadProgress: u, onDownloadProgress: u, decompress: u, maxContentLength: u, maxBodyLength: u, beforeRedirect: u, transport: u, httpAgent: u, httpsAgent: u, cancelToken: u, socketPath: u, responseEncoding: u, validateStatus: c };
      return w.forEach(Object.keys(e).concat(Object.keys(r)), function(d) {
        var v = h[d] || s, m = v(d);
        w.isUndefined(m) && v !== c || (i[d] = m);
      }), i;
    };
  });
  var ye = l((zn, Et) => {
    Et.exports = { version: "0.27.2" };
  });
  var Rt = l((Mn, Ct) => {
    "use strict";
    var Yr = ye().version, R = q(), ve = {};
    ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(t, e) {
      ve[t] = function(i) {
        return typeof i === t || "a" + (e < 1 ? "n " : " ") + t;
      };
    });
    var xt = {};
    ve.transitional = function(e, r, i) {
      function n(s, a) {
        return "[Axios v" + Yr + "] Transitional option '" + s + "'" + a + (i ? ". " + i : "");
      }
      return function(s, a, u) {
        if (e === false)
          throw new R(n(a, " has been removed" + (r ? " in " + r : "")), R.ERR_DEPRECATED);
        return r && !xt[a] && (xt[a] = true, console.warn(n(a, " has been deprecated since v" + r + " and will be removed in the near future"))), e ? e(s, a, u) : true;
      };
    };
    function Zr(t, e, r) {
      if (typeof t != "object")
        throw new R("options must be an object", R.ERR_BAD_OPTION_VALUE);
      for (var i = Object.keys(t), n = i.length; n-- > 0; ) {
        var s = i[n], a = e[s];
        if (a) {
          var u = t[s], c = u === void 0 || a(u, s, t);
          if (c !== true)
            throw new R("option " + s + " must be " + c, R.ERR_BAD_OPTION_VALUE);
          continue;
        }
        if (r !== true)
          throw new R("Unknown option " + s, R.ERR_BAD_OPTION);
      }
    }
    Ct.exports = { assertOptions: Zr, validators: ve };
  });
  var Nt = l(($n, St) => {
    "use strict";
    var qt = f(), en = ie(), Ot = De(), At = gt(), H = me(), tn = ue(), Tt = Rt(), k = Tt.validators;
    function P(t) {
      this.defaults = t, this.interceptors = { request: new Ot(), response: new Ot() };
    }
    P.prototype.request = function(e, r) {
      typeof e == "string" ? (r = r || {}, r.url = e) : r = e || {}, r = H(this.defaults, r), r.method ? r.method = r.method.toLowerCase() : this.defaults.method ? r.method = this.defaults.method.toLowerCase() : r.method = "get";
      var i = r.transitional;
      i !== void 0 && Tt.assertOptions(i, { silentJSONParsing: k.transitional(k.boolean), forcedJSONParsing: k.transitional(k.boolean), clarifyTimeoutError: k.transitional(k.boolean) }, false);
      var n = [], s = true;
      this.interceptors.request.forEach(function(m) {
        typeof m.runWhen == "function" && m.runWhen(r) === false || (s = s && m.synchronous, n.unshift(m.fulfilled, m.rejected));
      });
      var a = [];
      this.interceptors.response.forEach(function(m) {
        a.push(m.fulfilled, m.rejected);
      });
      var u;
      if (!s) {
        var c = [At, void 0];
        for (Array.prototype.unshift.apply(c, n), c = c.concat(a), u = Promise.resolve(r); c.length; )
          u = u.then(c.shift(), c.shift());
        return u;
      }
      for (var h = r; n.length; ) {
        var o = n.shift(), d = n.shift();
        try {
          h = o(h);
        } catch (v) {
          d(v);
          break;
        }
      }
      try {
        u = At(h);
      } catch (v) {
        return Promise.reject(v);
      }
      for (; a.length; )
        u = u.then(a.shift(), a.shift());
      return u;
    };
    P.prototype.getUri = function(e) {
      e = H(this.defaults, e);
      var r = tn(e.baseURL, e.url);
      return en(r, e.params, e.paramsSerializer);
    };
    qt.forEach(["delete", "get", "head", "options"], function(e) {
      P.prototype[e] = function(r, i) {
        return this.request(H(i || {}, { method: e, url: r, data: (i || {}).data }));
      };
    });
    qt.forEach(["post", "put", "patch"], function(e) {
      function r(i) {
        return function(s, a, u) {
          return this.request(H(u || {}, { method: e, headers: i ? { "Content-Type": "multipart/form-data" } : {}, url: s, data: a }));
        };
      }
      P.prototype[e] = r(), P.prototype[e + "Form"] = r(true);
    });
    St.exports = P;
  });
  var Pt = l((Hn, kt) => {
    "use strict";
    var rn = U();
    function _(t) {
      if (typeof t != "function")
        throw new TypeError("executor must be a function.");
      var e;
      this.promise = new Promise(function(n) {
        e = n;
      });
      var r = this;
      this.promise.then(function(i) {
        if (r._listeners) {
          var n, s = r._listeners.length;
          for (n = 0; n < s; n++)
            r._listeners[n](i);
          r._listeners = null;
        }
      }), this.promise.then = function(i) {
        var n, s = new Promise(function(a) {
          r.subscribe(a), n = a;
        }).then(i);
        return s.cancel = function() {
          r.unsubscribe(n);
        }, s;
      }, t(function(n) {
        r.reason || (r.reason = new rn(n), e(r.reason));
      });
    }
    _.prototype.throwIfRequested = function() {
      if (this.reason)
        throw this.reason;
    };
    _.prototype.subscribe = function(e) {
      if (this.reason) {
        e(this.reason);
        return;
      }
      this._listeners ? this._listeners.push(e) : this._listeners = [e];
    };
    _.prototype.unsubscribe = function(e) {
      if (this._listeners) {
        var r = this._listeners.indexOf(e);
        r !== -1 && this._listeners.splice(r, 1);
      }
    };
    _.source = function() {
      var e, r = new _(function(n) {
        e = n;
      });
      return { token: r, cancel: e };
    };
    kt.exports = _;
  });
  var Dt = l((Wn, _t) => {
    "use strict";
    _t.exports = function(e) {
      return function(i) {
        return e.apply(null, i);
      };
    };
  });
  var Bt = l((Jn, Ut) => {
    "use strict";
    var nn = f();
    Ut.exports = function(e) {
      return nn.isObject(e) && e.isAxiosError === true;
    };
  });
  var Ft = l((Vn, we) => {
    "use strict";
    var Lt = f(), sn = Q(), W = Nt(), an = me(), on = $();
    function jt(t) {
      var e = new W(t), r = sn(W.prototype.request, e);
      return Lt.extend(r, W.prototype, e), Lt.extend(r, e), r.create = function(n) {
        return jt(an(t, n));
      }, r;
    }
    var y = jt(on);
    y.Axios = W;
    y.CanceledError = U();
    y.CancelToken = Pt();
    y.isCancel = fe();
    y.VERSION = ye().version;
    y.toFormData = ae();
    y.AxiosError = q();
    y.Cancel = y.CanceledError;
    y.all = function(e) {
      return Promise.all(e);
    };
    y.spread = Dt();
    y.isAxiosError = Bt();
    we.exports = y;
    we.exports.default = y;
  });
  var ge = l((Kn, It) => {
    It.exports = Ft();
  });
  var D = Ae(ge(), 1);
  var C = "https://zesty-storage-prod.s3.amazonaws.com/images/zesty";
  var L = { tall: { width: 0.75, height: 1, style: { standard: `${C}/zesty-banner-tall.png`, minimal: `${C}/zesty-banner-tall-minimal.png`, transparent: `${C}/zesty-banner-tall-transparent.png` } }, wide: { width: 4, height: 1, style: { standard: `${C}/zesty-banner-wide.png`, minimal: `${C}/zesty-banner-wide-minimal.png`, transparent: `${C}/zesty-banner-wide-transparent.png` } }, square: { width: 1, height: 1, style: { standard: `${C}/zesty-banner-square.png`, minimal: `${C}/zesty-banner-square-minimal.png`, transparent: `${C}/zesty-banner-square-transparent.png` } } };
  var un = Ae(ge(), 1);
  var be = () => {
    let t = window.XRHand != null && window.XRMediaBinding != null, e = navigator.userAgent.includes("OculusBrowser"), r = t && e ? "Full" : t || e ? "Partial" : "None";
    return { match: r !== "None", confidence: r };
  };
  var Ee = () => {
    let t = window.mozInnerScreenX != null && window.speechSynthesis == null, e = navigator.userAgent.includes("Mobile VR") && !navigator.userAgent.includes("OculusBrowser"), r = t && e ? "Full" : t || e ? "Partial" : "None";
    return { match: r !== "None", confidence: r };
  };
  var zt = async () => {
    let t = navigator.xr && await navigator.xr.isSessionSupported("immersive-vr") && await navigator.xr.isSessionSupported("immersive-ar"), e = navigator.userAgent.includes("Pico Neo 3 Link"), r = t && e ? "Full" : t || e ? "Partial" : "None";
    return { match: r !== "None", confidence: r };
  };
  var Mt = () => {
    let t = navigator.maxTouchPoints === 0 || navigator.msMaxTouchPoints === 0, e = !navigator.userAgent.includes("Android") && !navigator.userAgent.includes("Mobile"), r = t && e ? "Full" : t || e ? "Partial" : "None";
    return { match: r !== "None", confidence: r };
  };
  var xe = async () => {
    let t = { platform: "", confidence: "" };
    return be().match ? t = { platform: "Oculus", confidence: be().confidence } : Ee().match ? t = { platform: "Wolvic", confidence: Ee().confidence } : await zt().match ? t = { platform: "Pico", confidence: await zt().confidence } : Mt().match ? t = { platform: "Desktop", confidence: Mt().confidence } : t = { platform: "Unknown", confidence: "None" }, t;
  };
  var $t = (t) => {
    if (t) {
      if (be().match) {
        if (t.includes("https://www.oculus.com/experiences/quest/")) {
          setTimeout(() => {
            window.open(t, "_blank");
          }, 1e3);
          return;
        }
      } else if (Ee().match) {
        let e = document.createElement("div"), r = document.createElement("div"), i = document.createElement("p"), n = document.createElement("button"), s = document.createElement("button");
        e.style.backgroundColor = "rgb(0, 0, 0, 0.75)", e.style.color = "white", e.style.textAlign = "center", e.style.position = "fixed", e.style.top = "50%", e.style.left = "50%", e.style.padding = "5%", e.style.borderRadius = "5%", e.style.transform = "translate(-50%, -50%)", i.innerHTML = `<b>This billboard leads to ${t}. Continue?</b>`, n.innerText = "Move cursor back into window.", n.style.width = "100vw", n.style.height = "100vh", n.onmouseenter = () => {
          n.style.width = "auto", n.style.height = "auto", n.innerText = "Yes";
        }, n.onclick = () => {
          window.open(t, "_blank"), e.remove();
        }, s.innerText = "No", s.onclick = () => {
          e.remove();
        }, e.append(r), r.append(i), r.append(n), r.append(s), document.body.append(e);
        return;
      }
      window.open(t, "_blank");
    }
  };
  var Ht = "https://beacon.zesty.market";
  var Wt = "https://beacon2.zesty.market/zgraphql";
  var cn = "https://api.zesty.market/api";
  var Jt = async (t, e = "tall", r = "standard") => {
    try {
      let i = encodeURI(window.top.location.href).replace(/\/$/, "");
      return (await D.default.get(`${cn}/ad?ad_unit_id=${t}&url=${i}`)).data;
    } catch {
      return console.warn("No active campaign banner could be located. Displaying default banner."), { Ads: [{ asset_url: L[e].style[r], cta_url: "https://www.zesty.market" }], CampaignId: "TestCampaign" };
    }
  };
  var Vt = async (t, e = null) => {
    let { platform: r, confidence: i } = await xe();
    try {
      let n = Ht + `/api/v1/space/${t}`;
      await D.default.put(n), await D.default.post(Wt, { query: `mutation { increment(eventType: visits, spaceId: "${t}", campaignId: "${e}", platform: { name: ${r}, confidence: ${i} }) { message } }` }, { headers: { "Content-Type": "application/json" } });
    } catch (n) {
      console.log("Failed to emit onload event", n.message);
    }
  };
  var Kt = async (t, e = null) => {
    let { platform: r, confidence: i } = await xe();
    try {
      let n = Ht + `/api/v1/space/click/${t}`;
      await D.default.put(n), await D.default.post(Wt, { query: `mutation { increment(eventType: clicks, spaceId: "${t}", campaignId: "${e}", platform: { name: ${r}, confidence: ${i} }) { message } }` }, { headers: { "Content-Type": "application/json" } });
    } catch (n) {
      console.log("Failed to emit onclick event", n.message);
    }
  };
  var Xt = "2.0.5";
  console.log("Zesty SDK Version: ", Xt);
  var hn = "https://ipfs.io/ipns/libv2.zesty.market/zesty-formats.js";
  var mn = "https://ipfs.io/ipns/libv2.zesty.market/zesty-networking.js";
  var J = class extends Component3 {
    static onRegister(e) {
      e.registerComponent(CursorTarget);
    }
    init() {
      this.formats = Object.values(L), this.formatKeys = Object.keys(L), this.styleKeys = ["standard", "minimal", "transparent"];
    }
    start() {
      if (this.mesh = this.object.getComponent(MeshComponent), !this.mesh)
        throw new Error("'zesty-banner ' missing mesh component");
      if (this.createAutomaticCollision && (this.collision = this.object.getComponent(CollisionComponent) || this.object.addComponent(CollisionComponent, { collider: Collider.Box, group: 2 }), this.cursorTarget = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget), this.cursorTarget.onClick.add(this.onClick.bind(this))), this.dynamicFormats) {
        let e = document.createElement("script");
        e.onload = () => {
          this.formatsOverride = zestyFormats.formats;
        }, e.setAttribute("src", hn), e.setAttribute("crossorigin", "anonymous"), document.body.appendChild(e);
      }
      this.dynamicNetworking ? import(mn).then((e) => {
        this.zestyNetworking = Object.assign({}, e), this.startLoading();
      }) : this.startLoading();
    }
    startLoading() {
      this.loadBanner(this.adUnit, this.formatKeys[this.format], this.styleKeys[this.style]).then((e) => {
        this.banner = e, this.scaleToRatio && (this.height = this.object.scalingLocal[1], this.object.resetScaling(), this.createAutomaticCollision && (this.collision.extents = [this.formats[this.format].width * this.height, this.height, 0.1]), this.object.scale([this.formats[this.format].width * this.height, this.height, 1]));
        let r = this.mesh.material.clone();
        if (this.textureProperty === "auto") {
          let i = r.shader;
          if (i === "Phong Opaque Textured")
            r.diffuseTexture = e.texture, r.alphaMaskThreshold = 0.3;
          else if (i === "Flat Opaque Textured")
            r.flatTexture = e.texture, r.alphaMaskThreshold = 0.8;
          else
            throw Error("'zesty-banner' unable to apply banner texture: unsupported pipeline " + i);
          this.mesh.material = r, this.mesh.material.alphaMaskTexture = e.texture;
        } else
          this.mesh.material[this.textureProperty] = e.texture, this.mesh.material.alphaMaskTexture = e.texture;
        this.beacon && (this.dynamicNetworking ? this.zestyNetworking.sendOnLoadMetric(this.adUnit, this.banner.campaignId) : Vt(this.adUnit, this.banner.campaignId));
      });
    }
    onClick() {
      this.banner?.url && (this.engine.xr ? this.engine.xr.session.end().then(this.executeClick.bind(this)) : this.engine.xrSession ? this.engine.xrSession.end().then(this.executeClick.bind(this)) : this.executeClick());
    }
    executeClick() {
      $t(this.banner.url), this.beacon && (this.dynamicNetworking ? this.zestyNetworking.sendOnClickMetric(this.adUnit, this.banner.campaignId) : Kt(this.adUnit, this.banner.campaignId));
    }
    async loadBanner(e, r, i) {
      let n = this.dynamicNetworking ? await this.zestyNetworking.fetchCampaignAd(e, r, i) : await Jt(e, r, i), { asset_url: s, cta_url: a } = n.Ads[0];
      return this.campaignId = n.CampaignId, this.engine.textures.load(s, "").then((u) => ({ texture: u, imageSrc: s, url: a, campaignId: n.CampaignId }));
    }
  };
  G(J, "TypeName", "zesty-banner"), G(J, "Properties", { adUnit: Property.string(""), format: Property.enum(["tall", "wide", "square"], "square"), style: Property.enum(["standard", "minimal", "transparent"], "transparent"), scaleToRatio: Property.bool(true), textureProperty: Property.string("auto"), assignAlphaMaskTexture: Property.bool(true), beacon: Property.bool(true), dynamicFormats: Property.bool(true), createAutomaticCollision: Property.bool(true), dynamicNetworking: Property.bool(false) });

  // js/button-lb-toggle.js
  var button_lb_toggle_exports = {};
  __export(button_lb_toggle_exports, {
    ButtonLbToggle: () => ButtonLbToggle
  });
  var ButtonLbToggle = class extends Component3 {
    start() {
      this.mesh = this.buttonMeshObject.getComponent("mesh");
      this.defaultMaterial = this.mesh.material;
      this.target = this.object.getComponent("cursor-target");
      this.target.addHoverFunction(this.onHover.bind(this));
      this.target.addUnHoverFunction(this.onUnHover.bind(this));
      this.target.addDownFunction(this.onDown.bind(this));
      this.target.addUpFunction(this.onUp.bind(this));
    }
    onHover(_, cursor) {
      this.mesh.material = this.hoverMaterial;
      if (cursor.type == "finger-cursor") {
        this.onDown(_, cursor);
      }
      this.hapticFeedback(cursor.object, 0.5, 50);
    }
    onDown(_, cursor) {
      this.buttonMeshObject.translate([0, -0.1, 0]);
      this.hapticFeedback(cursor.object, 1, 20);
    }
    onUp(_, cursor) {
      this.buttonMeshObject.translate([0, 0.1, 0]);
      this.hapticFeedback(cursor.object, 0.7, 20);
    }
    onUnHover(_, cursor) {
      this.mesh.material = this.defaultMaterial;
      if (cursor.type == "finger-cursor") {
        this.onUp(_, cursor);
      }
      this.hapticFeedback(cursor.object, 0.3, 50);
    }
    hapticFeedback(object, strength, duration) {
      const input = object.getComponent("input");
      if (input && input.xrInputSource) {
        const gamepad = input.xrInputSource.gamepad;
        if (gamepad && gamepad.hapticActuators)
          gamepad.hapticActuators[0].pulse(strength, duration);
      }
    }
  };
  __publicField(ButtonLbToggle, "TypeName", "button-lb-toggle");
  __publicField(ButtonLbToggle, "Properties", {
    buttonMeshObject: Property.object(),
    hoverMaterial: Property.material()
  });

  // js/button-start.js
  var button_start_exports = {};
  __export(button_start_exports, {
    ButtonStart: () => ButtonStart,
    hapticFeedback: () => hapticFeedback
  });
  function hapticFeedback(object, strength, duration) {
    const input = object.getComponent("input");
    if (input && input.xrInputSource) {
      const gamepad = input.xrInputSource.gamepad;
      if (gamepad && gamepad.hapticActuators)
        gamepad.hapticActuators[0].pulse(strength, duration);
    }
  }
  var ButtonStart = class extends Component3 {
    start() {
      this.mesh = this.buttonMeshObject.getComponent("mesh");
      this.defaultMaterial = this.mesh.material;
      this.target = this.object.getComponent("cursor-target");
      this.target.addHoverFunction(this.onHover.bind(this));
      this.target.addUnHoverFunction(this.onUnHover.bind(this));
      this.target.addDownFunction(this.onDown.bind(this));
      this.target.addUpFunction(this.onUp.bind(this));
      this.hide(false);
    }
    onHover(_, cursor) {
      this.mesh.material = this.hoverMaterial;
      if (cursor.type == "finger-cursor") {
        this.onDown(_, cursor);
      }
      hapticFeedback(cursor.object, 0.5, 50);
    }
    onDown(_, cursor) {
      this.buttonMeshObject.translate([0, -0.1, 0]);
      hapticFeedback(cursor.object, 1, 20);
    }
    onUp(_, cursor) {
      this.buttonMeshObject.translate([0, 0.1, 0]);
      this.hapticFeedback(cursor.object, 0.7, 20);
      window.gameOver = false;
      window.dispatchEvent(new Event("reset-game"));
      this.hide(true);
    }
    onUnHover(_, cursor) {
      this.mesh.material = this.defaultMaterial;
      if (cursor.type == "finger-cursor") {
        this.onUp(_, cursor);
      }
      this.hapticFeedback(cursor.object, 0.3, 50);
    }
    hapticFeedback(object, strength, duration) {
      const input = object.getComponent("input");
      if (input && input.xrInputSource) {
        const gamepad = input.xrInputSource.gamepad;
        if (gamepad && gamepad.hapticActuators)
          gamepad.hapticActuators[0].pulse(strength, duration);
      }
    }
    hide(b) {
      if (b == true) {
        this.object.parent.setPositionWorld([0, 0, 100]);
      } else {
        this.object.parent.setPositionWorld([0, 1.6, -0.5]);
      }
    }
  };
  __publicField(ButtonStart, "TypeName", "button-start");
  __publicField(ButtonStart, "Properties", {
    buttonMeshObject: { type: Type.Object },
    hoverMaterial: { type: Type.Material }
  });
  __publicField(ButtonStart, "Dependencies", [HowlerAudioSource]);

  // js/button.js
  var button_exports = {};
  __export(button_exports, {
    Button: () => Button
  });
  var Button = class extends Component3 {
    start() {
      this.mesh = this.buttonMeshObject.getComponent("mesh");
      this.defaultMaterial = this.mesh.material;
      this.target = this.object.getComponent("cursor-target");
      this.target.addHoverFunction(this.onHover.bind(this));
      this.target.addUnHoverFunction(this.onUnHover.bind(this));
      this.target.addDownFunction(this.onDown.bind(this));
      this.target.addUpFunction(this.onUp.bind(this));
      this.hide(true);
    }
    onHover(_, cursor) {
      this.mesh.material = this.hoverMaterial;
      if (cursor.type == "finger-cursor") {
        this.onDown(_, cursor);
      }
      this.hapticFeedback(cursor.object, 0.5, 50);
    }
    onDown(_, cursor) {
      this.buttonMeshObject.translate([0, -0.1, 0]);
      this.hapticFeedback(cursor.object, 1, 20);
    }
    onUp(_, cursor) {
      this.buttonMeshObject.translate([0, 0.1, 0]);
      this.hapticFeedback(cursor.object, 0.7, 20);
      window.gameOver = false;
      window.dispatchEvent(new Event("reset-game"));
    }
    onUnHover(_, cursor) {
      this.mesh.material = this.defaultMaterial;
      if (cursor.type == "finger-cursor") {
        this.onUp(_, cursor);
      }
      this.hapticFeedback(cursor.object, 0.3, 50);
    }
    hapticFeedback(object, strength, duration) {
      const input = object.getComponent("input");
      if (input && input.xrInputSource) {
        const gamepad = input.xrInputSource.gamepad;
        if (gamepad && gamepad.hapticActuators)
          gamepad.hapticActuators[0].pulse(strength, duration);
      }
    }
    hide(b) {
      if (b == true) {
        this.object.parent.setPositionWorld([0, 0, 100]);
      } else {
        this.object.parent.setPositionWorld([0, 1.6, -0.5]);
      }
    }
  };
  __publicField(Button, "TypeName", "button");
  __publicField(Button, "Properties", {
    buttonMeshObject: { type: Type.Object },
    hoverMaterial: { type: Type.Material }
  });

  // js/obstacle.js
  var obstacle_exports = {};
  __export(obstacle_exports, {
    Obstacle: () => Obstacle
  });
  var tempVec5 = new Float32Array(3);
  var tempQuat4 = new Float32Array(8);
  var Obstacle = class extends Component3 {
    init() {
      this.startPosition = new Float32Array(3);
    }
    start() {
      window.addEventListener("reset-game", this.reset.bind(this));
      this.object.getPositionWorld(this.startPosition);
    }
    update(dt) {
      if (!window.gameOver) {
        this.move(dt);
      }
    }
    move(dt) {
      tempVec5[2] = 3 * dt;
      this.object.translateLocal(tempVec5);
      this.object.getTransformWorld(tempQuat4);
      if (tempQuat4[6] > this.limitZ) {
        tempVec5[2] = this.resetLocZ;
        this.object.translateLocal(tempVec5);
      }
    }
    reset() {
      this.object.setPositionWorld(this.startPosition);
    }
  };
  __publicField(Obstacle, "TypeName", "obstacle");
  __publicField(Obstacle, "Properties", {
    resetLocZ: { type: Type.Float, default: -44 },
    limitZ: { type: Type.Float, default: 2 }
  });

  // js/player-control.js
  var player_control_exports = {};
  __export(player_control_exports, {
    PlayerControl: () => PlayerControl
  });
  var tempVec6 = new Float32Array(3);
  var tempQuat5 = new Float32Array(8);
  var PlayerControl = class extends Component3 {
    start() {
      this.canJump = true;
      this.score = 0;
      this.highestScore = 0;
      window.gameOver = true;
      window.addEventListener("keydown", this.pressStart.bind(this));
      this.engine.onXRSessionStart.add(() => {
        this.engine.xr.session.addEventListener(
          "selectstart",
          this.pressStart.bind(this)
        );
      });
      this.object.getComponent("physx").onCollision(this.onCollision.bind(this));
      window.addEventListener("reset-game", this.reset.bind(this));
    }
    update(dt) {
      if (!window.gameOver) {
        this.score += 1 * dt * 13;
        this.scoreText.getComponent("text").text = `Score: ${Math.round(this.score)}`;
      }
      if (this.jump == true) {
        tempVec6[1] = 5.5 * dt;
        this.object.translateLocal(tempVec6);
        this.object.getTransformWorld(tempQuat5);
        if (tempQuat5[5] > 1.2) {
          this.jump = false;
          this.canJump = false;
        }
      } else {
        this.object.getTransformWorld(tempQuat5);
        if (tempQuat5[5] > 0) {
          tempVec6[1] = -4.5 * dt;
          this.object.translateLocal(tempVec6);
        } else {
          this.canJump = true;
        }
      }
    }
    pressStart(e) {
      if (!window.gameOver && this.canJump) {
        this.jump = true;
      }
    }
    onCollision(event, other) {
      if (event != WL.CollisionEventType.Touch) {
        return;
      }
      this.resetButton.getComponent("button").hide(false);
      window.gameOver = true;
      this.score = Math.round(this.score);
      if (this.highestScore < this.score) {
        this.highestScore = this.score;
        this.highestScoreText.getComponent("text").text = `Highest Score: ${this.score}`;
      }
    }
    reset() {
      this.score = 0;
      this.resetButton.getComponent("button").hide(true);
    }
  };
  __publicField(PlayerControl, "TypeName", "player-control");
  __publicField(PlayerControl, "Properties", {
    resetButton: { type: Type.Object },
    scoreText: { type: Type.Object },
    highestScoreText: { type: Type.Object }
    // Удалено: leaderBoard
  });

  // cache/js/_editor_index.js
  _registerEditor(dist_exports);
  _registerEditor(zesty_wonderland_sdk_exports);
  _registerEditor(button_lb_toggle_exports);
  _registerEditor(button_start_exports);
  _registerEditor(button_exports);
  _registerEditor(obstacle_exports);
  _registerEditor(player_control_exports);
})();
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.3
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.3
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/