var layersample = {
        config: {
            serverUrl: "https://api.layer.com",
            appId: "3aa3877e-0e36-11e5-8ad9-9fa92d006ff0",
            userId: null
        },
        headers: {
            Accept: "application/vnd.layer+json; version=1.0",
            Authorization: "",
            "Content-type": "application/json"
        },
        conversationIndex : null,
        conversationUrl: null,
        msgNum: null
    };


    /**
     * To get started, we must obtain a Nonce
     *
     * http://bit.ly/1xYNf7z#obtaining-a-nonce
     *
     * @method
     * @return {$.Deferred}
     */
    function getNonce() {
        var d = new $.Deferred();
        $.ajax({
            url: layersample.config.serverUrl + "/nonces",
            method: "POST",
            headers: layersample.headers
        })
            .done(function(data, textStatus, xhr) {
                d.resolve(data.nonce);
            });
        return d;
    }

    /**
     * Example of getting an identity token.
     *
     * Replace this function with whatever service you are
     * getting an Identity Token from.
     *
     * @method
     * @param  {string} nonce   Token is provided by REST server for use by identity provider
     * @return {$.Deferred}
     */
    function getIdentityToken(nonce) {
        var d = new $.Deferred();
        $.ajax({
            url: "https://layer-identity-provider.herokuapp.com" +  "/identity_tokens",
            headers: {
                "X_LAYER_APP_ID": layersample.config.appId,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            method: "POST",
            data: JSON.stringify({
                app_id: layersample.config.appId,
                user_id: layersample.config.userId,
                nonce: nonce
            })
        })
            .then(function(data, textStatus, xhr) {
                d.resolve(data.identity_token);
            });
        return d;
    }

    /**
     * Create a session using the identity_token
     *
     * http://bit.ly/1xYNf7z#authenticating-with-an-identity-token
     *
     * @method
     * @param  {string} identityToken   Identity token returned by your identity provider
     * @return {$.Deferred}
     */
    function getSession(identityToken) {
        var d = new $.Deferred();
        $.ajax({
            url: layersample.config.serverUrl + "/sessions",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({
                "identity_token": identityToken,
                "app_id": layersample.config.appId
            })
        })
            .then(function(data, textStatus, xhr) {
                d.resolve(data.session_token);
            });
        return d;
    }

    /**
     * Create a conversation
     *
     * http://bit.ly/1xYNf7z#creating-a-conversation
     *
     * @method
     * @param  {string[]} participants  Array of participant-ids
     * @return {$.Deferred}
     */
    function createConversation(participants) {
        return $.ajax({
            url: layersample.config.serverUrl + "/conversations",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({
                participants: participants,
                distinct: true
            })
        });
    }

   
    function setConversationMetadata(conversationUrl, title, CId) {
        return $.ajax({
            url: conversationUrl,
            method: "PATCH",
            headers: {
                "Accept": "application/vnd.layer+json; version=1.0",
                "Authorization": layersample.headers.Authorization,
                "Content-type": "application/vnd.layer-patch+json"
            },
            data: JSON.stringify([
                {
                    operation: "set",
                    property: "metadata.title",
                    value: title                
                },
                {
                    operation: "set",
                    property: "metadata.CId",
                    value: CId                
                }
            ])
        });
    }

    /**
     * Lists all Conversations
     *
     * http://bit.ly/1xYNf7z#listing-conversations
     *
     * @method
     * @return {$.Deferred}
     */
    function getConversations() {
        return $.ajax({
            url: layersample.config.serverUrl + "/conversations",
            method: "GET",
            headers: layersample.headers
        })
    }

    function checkConExist(conversations, CId) {
        for(var i=0; i<conversations.length; i++) {
            if(conversations[i].metadata.CId == CId) {
                layersample.conversationIndex = i;
                return true;
            }
        }

        return false;
    }

    /**
     * Download description of a single Conversation
     *
     * http://bit.ly/1xYNf7z#listing-conversations
     *
     * @method
     * @param  {string} conversationUrl     URL of the requested resource
     * @return {$.Deferred}
     */
    function getOneConversation(conversationUrl) {
        return $.ajax({
            url: conversationUrl,
            method: "GET",
            headers: layersample.headers
        })
    }

    /**
     * Listing Messages in a Conversation:
     *
     * http://bit.ly/1xYNf7z#listing-messages-in-a-conversation
     *
     * @method
     * @param  {string} conversationUrl     URL of the requested resource
     * @return {$.Deferred}
     */
    function getMessages(conversationUrl) {
        return $.ajax({
            url: conversationUrl + "/messages",
            method: "GET",
            headers: layersample.headers
        })
    }

    /**
     * Retrieving a single Message
     *
     * http://bit.ly/1xYNf7z#retrieving-a-message
     *
     * @method
     * @param  {string} messageUrl      URL of the requested resource
     * @return {$.Deferred}
     */
    function getOneMessage(messageUrl) {
        return $.ajax({
            url: messageUrl,
            method: "GET",
            headers: layersample.headers
        })
    }

    /**
     * Sending a Message:
     *
     * http://bit.ly/1xYNf7z#sending-a-message
     *
     * This function sends only a single message part, but could easily be
     * adapted to send more.
     *
     * @method
     * @param  {string} conversationUrl     URL of the resource to operate upon
     * @param  {string} body                Message contents
     * @param  {string} mimeType            Mime type for the message contents (e.g. "text/plain")
     * @return {$.Deferred}
     */
    function sendMessage(conversationUrl, body, mimeType) {
        return $.ajax({
            url: conversationUrl + "/messages",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({
                parts: [{
                    body: body,
                    mime_type: mimeType
                }]
            })           
        });
    }

    /**
     * Writing a Receipt for a Message (i.e. marking it as read or delivered)
     *
     * http://bit.ly/1xYNf7z#writing-a-receipt-for-a-message
     *
     * @method
     * @param  {string} messageUrl      URL of the resource to operate upon
     * @return {$.Deferred}
     */
    function markAsRead(messageUrl) {
        return $.ajax({
            url: messageUrl + "/receipts",
            method: "POST",
            headers: layersample.headers,
            data: JSON.stringify({type: "read"})
        });
    }

    /**
     * Delete a message from the server and all mobile clients
     *
     * http://bit.ly/1xYNf7z#deleting-a-message
     *
     * @method
     * @param  {string} messageUrl      URL of the resource to operate upon
     * @return {$.Deferred}
     */
    function deleteMessage(messageUrl) {
        return $.ajax({
            url: messageUrl + "?destroy=true",
            method: "DELETE",
            headers: layersample.headers
        });
    }

   