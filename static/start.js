
var win = $( this );

wql.getConfig( function( error, result ){

    if( !error && result.length ){

        if( result[0].width !== win.width() && result[0].height !== win.height() ){
            wz.fit( win, result[0].width - win.width(), result[0].height - win.height() );
        }else if( result[0].width !== win.width() ){
            wz.fit( win, result[0].width - win.width(), 0 );
        }else if( result[0].height !== win.height() ){
            wz.fit( win, 0, result[0].height - win.height() );
        }

    }else{

        wql.insertConfig();

    }

    start();

});
