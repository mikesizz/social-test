(() => {
    const CACHE_KEY = 'INTERNET_PARTY';

    let cache = window.localStorage.getItem(CACHE_KEY);

    if (!cache) {
        const pw = prompt("You don't seem to have any data. Please create one by providing a password. This will not be stored.");

        if (!pw) {
            throw new Error('no pw');
        }

        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify({}), pw);

        window.localStorage.setItem(CACHE_KEY, ciphertext);

        cache = {};
    } else {
        try {
            const pw = prompt("Please enter your password");

            let plaintext;

            if (!pw) {
                throw new Error('no pw');
            } else {
                plaintext = CryptoJS.AES.decrypt(cache, pw);
            }

            if (!plaintext) {
                throw new Error('bad pw');
            }

            plaintext = plaintext.toString(CryptoJS.enc.Utf8);

            try {
                cache = JSON.parse(plaintext);   
            } catch (error) {
                throw new Error('bad parse');
            }
        } catch (err) {
            console.error('Failed to parse cache');
            console.error(err);

            throw err;
        }
    }

    let {
        IPNS_KEY,
        PINATA_KEY
    } = cache;

    if (!IPNS_KEY) {
        const ipnsKey = prompt("Please provide your access key for ipns.nofungible.cloud. This will be stored locally on your device, and encrypted by your password.");

        if (!ipnsKey) {
            throw new Error('No IPNS auth token');
        }

        const pw = prompt("Please enter your password");

        if (!pw) {
            throw new Error('no pw');
        }

        IPNS_KEY = cache.IPNS_KEY = ipnsKey;

        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cache), pw);

        window.localStorage.setItem(CACHE_KEY, ciphertext);
    }

    if (!PINATA_KEY) {
        const pinataKey = prompt("Please provide your access key for pinata.cloud. This will be stored locally on your device, and encrypted by your password.");

        if (!pinataKey) {
            throw new Error('No pinata auth token');
        }

        const pw = prompt("Please enter your password");

        if (!pw) {
            throw new Error('no pw');
        }

        PINATA_KEY = cache.PINATA_KEY = pinataKey;

        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cache), pw);

        window.localStorage.setItem(CACHE_KEY, ciphertext);
    }

    const session = cache;
    const BeaconWallet = beacon.DAppClient;
    const state = {feed: {}};
    const actionHandlers = {
        'sync-wallet': function () {
            if (state.walletAddress) {
                unsyncWallet();
            } else {
                syncWallet();
            }
        },
        'create-new-post': function () {
            document.querySelector('#new-post-content').innerText = '';
            document.querySelector('#post-container').classList.remove('hidden');
        },
        'cancel-new-post': function () {
            document.querySelector('#post-container').classList.add('hidden');
            document.querySelector('#new-post-content').innerText = '';
        },
        'publish-new-post': async function () {
            const newContent = document.querySelector('#new-post-content').innerText;
            const now = Date.now();
// TODO make the indexer respect the new structure - rethink using timestamp as id
            state.feed.posts[now] = {content: newContent, createdAt: now};

            document.querySelector('#post-container').classList.add('hidden');
            document.querySelector('#new-post-content').innerText = '';
        
            updateFeed().catch(console.error);
        }
    }

    boot();

    async function boot() {
        const record = await findOrCreateFeedAddress();

        state.record = record;

        if (!state.record.ipfs.cid) {
            state.feed = {posts: {}, interactions: {}};

            await updateFeed()
        } else {
            session.cid = state.record.ipfs.cid;
        }

        const feed = await getFeed();

        if (feed) {
            state.feed = feed;

            if (state.feed.posts && Object.values(state.feed.posts).length) {
                state.domain = Object.values(state.feed.posts)[0].domain;
            }
        } else {
            state.feed = {posts: {}, interactions: {}};

            updateFeed();
        }

        populateFeed().catch(console.error);

        state.wallet = new BeaconWallet({
            name: 'tzAudio',
            eventHandlers: {
                ACTIVE_ACCOUNT_SET: {
                    handler: async function (activeBeaconAccount) {
                        try {
                            console.log('Beacon Wallet SDK initialized', activeBeaconAccount);
    
                            if (activeBeaconAccount && activeBeaconAccount.address) {
                                document.querySelector('#sync-button').innerText = 'UNSYNC';
    
                                state.walletAddress = activeBeaconAccount.address;
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
        });
    
        document.querySelectorAll('.action-controller').forEach((el) => {
            el.onclick = () => {
                const action = el.getAttribute('data-action');
            
                if (actionHandlers[action]) {
                    actionHandlers[action](el);
                }
            };
        });

        let loop;

        _loop();
    
        async function _loop() {
            loop && clearTimeout(loop);
    
            populateMembers().catch(console.error);

            if (state.domain) {
                await request('PUT', 'https://1124-2601-602-9b01-c4f0-7c7d-e108-c4bf-7785.ngrok.io/api/content', {
                    "domain": state.domain
                });
            }
    
            loop = setTimeout(_loop, 5000);
        }
    }

    function syncWallet() {
        return state.wallet.requestPermissions();
    }

    async function unsyncWallet() {
        await state.wallet.removeAllAccounts();

        state.walletAddress = null
        document.querySelector('#sync-button').innerText = 'SYNC';
    }

    async function getFeed() {
        try {
            return await request('GET', `https://cloudflare-ipfs.com/ipns/${state.record.ipfs.key}?ts=${Date.now()}`);
        } catch (err) {
            return null;
        }
    }

    async function postContent(content) {
        const {IpfsHash: cid} = await request('POST', 'https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            "pinataContent": content
        }, {
            'Authorization': 'Bearer ' + PINATA_KEY
        });

        if (session.cid) {
            request('DELETE', `https://api.pinata.cloud/pinning/unpin/${session.cid}`, null, {
                'Authorization': 'Bearer ' + PINATA_KEY
            }).catch((err) => {
                console.error('Failed to delete old content file');
                console.error(err);
            });
        }

        session.cid = cid;

        return cid;
    }

    async function updateFeed() {
        const cid = await postContent(state.feed);
        const controller = new AbortController();

        setTimeout(() => {
            controller.abort();
        }, 5000);

        try {
            await request('GET', `https://cloudflare-ipfs.com/ipfs/${cid}?ts=${Date.now()}`, null, null, controller.signal);
        } catch (err) {

        }

        state.cid = cid;

        await updateRecord(state.record.id, cid);

        if (state.feed.posts && Object.values(state.feed.posts).length) {
            state.domain = Object.values(state.feed.posts)[0].domain;
        }

        return cid;
    }

    async function findOrCreateFeedAddress() {
        const records = await request('GET', `https://ipns.nofungible.cloud/api/record/list`, null, {
            'Authorization': 'Basic ' + btoa('no:fungible'),
            'no-fungible-auth-token': 'Bearer ' + IPNS_KEY
        });

        if (records && records.length) {
            return records[0];
        }

        const record = await request('POST', `https://ipns.nofungible.cloud/api/record`, {alias: 'social media feed'}, {
            'Authorization': 'Basic ' + btoa('no:fungible'),
            'no-fungible-auth-token': 'Bearer ' + IPNS_KEY
        });

        return record;
    }    

    async function updateRecord(id, cid) {
        await request('PUT', `https://ipns.nofungible.cloud/api/record/${id}`, {cid, localCache: true}, {
            'Authorization': 'Basic ' + btoa('no:fungible'),
            'no-fungible-auth-token': 'Bearer ' + IPNS_KEY
        });
    }

    async function request(method, url, body, headers = {}, signal) {
        const response = await fetch(
            url,
            Object.assign({
                method,
                headers: Object.assign({
                    'Content-Type': 'application/json'
                }, headers),
            }, body ? {body: JSON.stringify(body)} : {}, signal ? {signal} : {})
        );

        return response.json();
    }

    async function populateMembers() {
        const {members} = await request('GET', 'https://1124-2601-602-9b01-c4f0-7c7d-e108-c4bf-7785.ngrok.io/api/members');
        const memberList = document.querySelector('#member-list');

        memberList.innerHTML =
            `<br>
            <p style="text-indent: 10px;">Members:</p>
            <br>`;

        members.forEach((member) => {
            memberList.innerHTML += 
                `<div class="profile-panel">
                    <div class="pfp"></div>
                    <div class="nameplate">
                        <span class="name">${member}</span>
                    </div>
                </div>`;
        });
    }

    async function populateFeed() {
        document.querySelector('#social-feed').innerHTML = '';

        const feed = await request('GET', 'https://1124-2601-602-9b01-c4f0-7c7d-e108-c4bf-7785.ngrok.io/api/feed');

        feed.forEach((post) => {
            document.querySelector('#social-feed').innerHTML += 
                `<div class="social-post">
                    <div class="pfp-container">
                        <div class="pfp"></div>
                    </div>
                    <div class="content-container">
                        <p class="name">${post.domain}</p>
                        <p class="address">${post.address}</p>
                        <div class="content">
                            <iframe style="width:400px; height: 400px;" srcdoc="${post.content.replace(/"/g, "'")}" sandbox seamless></iframe>
                        </div>
                    </div>
                </div>`;
        });
    }
})();