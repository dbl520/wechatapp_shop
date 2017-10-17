import Config from '../config';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import Utility from '../utils/utility';
//import MemberLoginState from '../utils/memberState';

export default class HomeChannel {
    constructor(options) {
        this.options = options;

        this.cache = {
            hotProductData: [],
            timePageModuleData: [],
            pageModuleData: [],
            pageListData: []
        };
    }
    findPageModuleCache(code) {
        let item = this.cache.pageModuleData.find((item, index) => {
            return item.code === code;
        });
        if (item) {
            return item.data;
        }
    }
    findPageListCache(code) {
        let item = this.cache.pageListData.find((item, index) => {
            return item.code === code;
        });
        if (item) {
            return item.list;
        }
        else {
            return [];
        }
    }
    async getPageProductList(listCode, page, pageSize) {
        let data = this.findPageListCache(listCode + '_' + page);
        if (data.length === 0) {
            let command_url = Config.ApiHost + '/index.aspx?post=list';
            try {
                let responseData = await Utility.wxrequest(command_url, { data: { code: listCode, page, page_size: pageSize } });
                if (responseData.result === 1) {
                    data = responseData.list;
                    if (data.length > 0) {
                        this.cache.pageListData.push({ code: listCode + '_' + page, list: data });
                    }
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async getPageModuleList(moduleCode) {
        let data = this.findPageModuleCache(moduleCode);
        if (!data) {
            let command_url = Config.ApiHost + '/index.aspx?post=module';
            try {
                const responseData = await Utility.wxrequest(command_url, { data: { code: moduleCode } });
                if (responseData.result === 1) {
                    data = responseData;
                    this.cache.pageModuleData.push({ code: moduleCode, data });
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }
    /*
    async getScoreExchTicketList(ticketActivityIdArray) {
        let data = [];
        let command_url = Config.ApiHost + '/scoreExchange.aspx';
        let fetchHeaders = {
            'Content-Platform': 'wap'
        }
        try {
            let responseData = await fetch(command_url, { headers: fetchHeaders, body: { tid: ticketActivityIdArray } }).then(response => response.json());
            if (responseData.result === 1) {
                data = responseData.list;
            }
            else {
                console.warn(responseData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
        return data;
    }
    async scoreExchTicket(ticketActivityId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let post_data = 'exch_id=' + ticketActivityId;
            let command_url = Config.ApiHost + '/scoreExchange.aspx?post=exch_ticket&member_id=' + memberId + '&' + post_data;
            let fetchHeaders = {
                'Content-Platform': 'wap'
            }
            try {
                let responseData = await fetch(command_url, { headers: fetchHeaders }).then(response => response.json());
                return responseData;
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async getQrcodeHandle(qrcode) {
        let command_url = Config.ApiHost + '/qrcodeResult.aspx?qrcode=' + encodeURIComponent(qrcode);
        try {
            let responseData = await fetch(command_url).then(response => response.json());
            if (responseData.result === 1) {
                return responseData.info;
            }
            else {
                console.warn(responseData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }*/

    async getSearchKeyword() {
        let command_url = Config.ApiHost + '/search.aspx';
        try {
            let responseData = await Utility.wxrequest(command_url);
            if (responseData.result === 1) {
                return responseData.list;
            }
            else {
                console.warn(responseData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

}