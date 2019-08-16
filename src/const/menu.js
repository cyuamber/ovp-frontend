
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
                auth: ['admin', 'customer'],
                name: 'Test Objects MG',
                iconType: 'laptop',
                isChildren: true,
                children: ['VNF Type MGT', 'VNF Type Objects MGT']
            },
            {
                auth: ['admin'],
                name: 'Test ENV MGT',
                iconType: 'upload',
                isChildren: true,
                children: ['VIM/VNFM ENV MGT']
            },
            {
                auth: ['admin'],
                name: 'Test MGT',
                iconType: 'bar-chart',
                isChildren: true,
                children: ['Test Instrument MGT', 'VNF/PNF suite MGT']
            },
            {
                auth: ['admin'],
                name: 'Test Job MGT',
                iconType: 'cloud-o',
                isChildren: false,
                children: null
            },
            {
                auth: ['admin'],
                name: 'Test Case MGT',
                iconType: 'appstore-o',
                isChildren: false,
                children: null
            },
            {
                auth: ['admin'],
                name: 'Test Standard MGT',
                iconType: 'team',
                isChildren: false,
                children: null
            },

        ]
}
