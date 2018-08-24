var loadState = {

    preload: function() {

        var loadingLabel = game.add.text(80, 150, 'loading...',
            { font: '30px Courier', fill: '#ffffff' });

        //  load up assets
       
        game.load.image('login', './assets/buttons/login.png');
        game.load.image('logout', './assets/buttons/logout.png');
        game.load.image('background', './assets/background.png');
        game.load.image('slidingpanel', './assets/slidingpanel.png');
        game.load.image('slidingpanelheader', './assets/slidingpanelheader.png');
        game.load.image('gameheader', './assets/gameheader.png');
        game.load.image('slidingpanelside', './assets/slidingpanelside.png');
        game.load.image('restore', './assets/restore.png');
        game.load.image('expand', './assets/expand.png');
        game.load.image('minimise', './assets/minimise.png');
        game.load.image('up', './assets/up.png');
        game.load.image('down', './assets/down.png');
        game.load.image('save', './assets/buttons/save.png');
        game.load.image('close', './assets/buttons/close.png');
        game.load.image('new', './assets/buttons/new.png');
        game.load.image('delete', './assets/buttons/delete.png');
        game.load.image('colors', './assets/buttons/colors.png');

        //  an example of calling a BE and dealing with the result
        // usersBE.add({firstname: 'Jim', 
        //                         surname: 'Cashion', 
        //                         nicname: 'JimCashion', 
        //                         class: 'SuperAdmin', 
        //                         loginname: 'Jim', 
        //                         password: 'jim'})
        // .then(
        //     function(response) 
        //     {
        //         //  nothing to do, it worked!!
        //     },
        //     function(err) 
        //     {
        //         //  promise rejected because of error
        //         alert(err.data);

        //         //  abort the whole thing
        //         return;
                
        //     }
        // );
        
        //  initiale applicaiton
        this.initialise();
    },

    create: function() {
    
        game.state.start('intro');
    },

    initialise: async function() 
    {
        try
        {
            var result = await usersBE.list();
            //  we got something (I.E. nothing!)
            if(result.length == 0)
            {
                //  Create a superduper user to get us started
                result = await usersBE.add({firstname: 'Super', 
                               surname: 'User', 
                               nicname: 'SuperDuperUser', 
                               class: 'SuperAdmin', 
                               loginname: 'admin', 
                               password: 'Password1'});
               
            }
        }
        catch (err)
        {
            alert(err.message);
        }    
              

        // usersBE.list()
        // .then(
        //     function(result) 
        //     {
        //         //  we got something
        //         if(result.length == 0)
        //         {
        //             //  Create a superduper user to get us started
        //             usersBE.add({firstname: 'Super', 
        //                         surname: 'User', 
        //                         nicname: 'SuperDuperUser', 
        //                         class: 'SuperAdmin', 
        //                         loginname: 'admin', 
        //                         password: 'Password1'})
        //             .then(
        //             function(response) 
        //             {
        //                 //  nothing to do, it worked!!
        //             },
        //             function(err) 
        //             {
        //                 //  promise rejected because of error
        //                 alert(err.data);

        //                 //  abort the whole thing
        //                 return;
                        
        //             }
        //         );
                   
        //         }

        //     },
        //     function(err) 
        //     {
        //         //  error condition
        //         alert(err);
        //     }

        // );
    }
}