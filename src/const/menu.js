export default {
    menuItems:
        [
            {
                auth: ['admin', 'customer'],
                name: 'Dashboard',
                iconType: 'dashboard',
                isChildren: false,
                children: null
            },
            {
                auth: ['admin'],
                name: 'Test ENV MGT',
                iconType: 'upload',
                isChildren: true,
                children: [{
                    auth: ['admin', 'customer'],
                    name: 'VIM/VNFM ENV MGT',
                    iconType: '',
                },{
                    auth: ['admin','customer'],
                    name: 'Instrument MGS MGT',
                    iconType: '',
                },
                    {
                        auth: ['admin', 'customer'],
                        name: 'Instrument Package MGT',
                        iconType: '',
                    }]
            },
            {
                auth: ['admin', 'customer'],
                name: 'Test Objects MGT',
                iconType: 'laptop',
                isChildren: true,
                children: [{
                    auth: ['admin', 'customer'],
                    name: 'Test SUT MGT',
                    iconType: '',
                }]
            },
            // {
            //     auth: ['admin', 'customer'],
            //     name: 'Test Instrument MGT',
            //     iconType: 'bar-chart',
            //     isChildren: true,
            //     children: [{
            //         auth: ['admin'],
            //         name: 'Instrument MGS MGT',
            //         iconType: '',
            //     },
            //     {
            //         auth: ['admin', 'customer'],
            //         name: 'Instrument Package MGT',
            //         iconType: '',
            //     }]
            // },
            {
                auth: ['admin'],
                name: 'Test Job MGT',
                iconType: 'cloud-o',
                isChildren: false,
                children: null
            },
            // {
            //     auth: ['admin'],
            //     name: 'Test Case MGT',
            //     iconType: 'appstore-o',
            //     isChildren: false,
            //     children: null
            // },
            {
                auth: ['admin', 'customer'],
                name: 'Test Spec MGT',
                iconType: 'team',
                isChildren: false,
                children: null
            },

        ]
}
