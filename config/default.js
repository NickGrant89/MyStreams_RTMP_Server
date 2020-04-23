// Add import at the start of file
let User = require('../models/user');

const config = {
    server: {
        secret: 'kjVkuti2xAyF3JGCzSZTk0YWM5JhI9mgQW4rytXc'
    },
    rtmp_server: {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 60,
            ping_timeout: 30
        },
        http: {
            port: 8888,
            mediaroot: './media',
            allow_origin: 'http://192.168.178.23:3000'
        },
        /* https: {
    
      port: 8443,
        webroot: './public',
        key: './privkey.pem',
        cert: './fullchain.pem',
        mediaroot: './media',
        allow_origin: '*',
  }, */
        trans: {
            ffmpeg: '/usr/bin/ffmpeg',
            tasks: [
                {
                    app: 'live',
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    dash: true,
                    dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
                }
            ]
        },
        relay: {
            ffmpeg: '/usr/bin/ffmpeg',
            tasks: [
              {
                
              }
            ]
          }
    }
};
 
module.exports = config;