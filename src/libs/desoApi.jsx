import axios from "axios";
// import { toast } from "react-toastify";
//var axios = require('axios')

const DEFAULT_NODE_URL = "https://node.deso.org/api";
//const DEFAULT_NODE_URL = "https://api.desodev.com/api"
let client = null;
class DesoApi {
  constructor() {
    this.client = null;
    this.baseUrl = DEFAULT_NODE_URL;
  }

  async getPostsForPublicKey(
    username,
    publicKey,
    lastPostHashHex,
    numToFetch = 10
  ) {
    if (!username && !publicKey) {
      console.log("username or publicKey is required");
      return;
    }

    const path = "/v0/get-posts-for-public-key";
    const data = {
      PublicKeyBase58Check: publicKey,
      Username: username,
      ReaderPublicKeyBase58Check: "",
      LastPostHashHex: lastPostHashHex,
      NumToFetch: numToFetch,
      MediaRequired: false,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSingleProfile(publicKey) {
    const path = "/v0/get-single-profile";
    const data = {
      PublicKeyBase58Check: publicKey,
    };

    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSinglePost(
    postHash,
    commentLimit = 20,
    fetchParents = false,
    commentOffset = 0,
    addGlobalFeedBool = false
  ) {
    if (!postHash) {
      console.log("postHash is required");
      return;
    }

    const path = "/v0/get-single-post";
    const data = {
      PostHashHex: postHash,
      ReaderPublicKeyBase58Check: "",
      FetchParents: fetchParents,
      CommentOffset: commentOffset,
      CommentLimit: commentLimit,
      AddGlobalFeedBool: addGlobalFeedBool,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async uploadVideo() {
    const path = "/v0/upload-video";
    try {
      const result = await this.getClient().post(path);
      console.log("result", result);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async submitPost(publicKey, body, postExtraData) {
    if (!publicKey) {
      console.log("publicKey is required");
      return;
    }

    if (!body) {
      console.log("body is required");
      return;
    }

    const path = "/v0/submit-post";
    const data = {
      UpdaterPublicKeyBase58Check: publicKey,
      PostHashHexToModify: "",
      ParentStakeID: "",
      Title: "",
      BodyObj: { Body: body, ImageURLs: [] },
      RecloutedPostHashHex: "",
      PostExtraData: postExtraData,
      Sub: "",
      IsHidden: false,
      MinFeeRateNanosPerKB: 1000,
      VideoURLs: [
        "https://iframe.videodelivery.net/e728cf80d7db0ce42b3ec4344d7b5cbd",
      ],
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createLike(
    isUnlike,
    LikedPostHashHex,
    MinFeeRateNanosPerKB,
    publicKey
  ) {
    const path = "/v0/create-like-stateless";
    const data = {
      isUnlike: isUnlike,
      LikedPostHashHex: LikedPostHashHex,
      MinFeeRateNanosPerKB: MinFeeRateNanosPerKB,
      ReaderPublicKeyBase58Check: publicKey,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async uploadImage(file, jwt, publicKey) {
    const path = "/v0/upload-image";
    const data = {
      file: file,
      UserPublicKeyBase58Check: publicKey,
      JWT: jwt,
    };
    try {
      const result = await this.getClient().post(path, data, {
        headers: {
          "content-type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
      });
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async sendBitclout(publicKey, amount, recipent) {
    const path = "/v0/send-deso";
    const data = {
      MinFeeRateNanosPerKB: 1000,
      AmountNanos: amount,
      SenderPublicKeyBase58Check: publicKey,
      RecipientPublicKeyOrUsername: recipent,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      alert("An error occured in money transactions.");
      return null;
    }
  }

  async makeThePostNft(NFTPostHashHex, publicKey) {
    const path = "/v0/create-nft";
    const data = {
      AdditionalCoinRoyaltiesMap: {},
      AdditionalDESORoyaltiesMap: {},
      BuyNowPriceNanos: 0,
      HasUnlockable: false,
      IsForSale: false,
      MinBidAmountNanos: 0,
      MinFeeRateNanosPerKB: 1000,
      NFTPostHashHex: NFTPostHashHex,
      NFTRoyaltyToCoinBasisPoints: 1000,
      NFTRoyaltyToCreatorBasisPoints: 500,
      NumCopies: 1,
      UpdaterPublicKeyBase58Check: publicKey,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getPosts() {
    const path = "/v0/get-posts-stateless";
    const data = {
      AddGlobalFeedBool: false,
      FetchSubcomments: false,
      GetPostsByDESO: false,
      GetPostsForFollowFeed: false,
      GetPostsForGlobalWhitelist: true,
      MediaRequired: false,
      NumToFetch: 50000,
      OrderBy: "",
      PostContent: "",
      PostHashHex: "",
      PostsByDESOMinutesLookback: 0,
      ReaderPublicKeyBase58Check:
        "BC1YLiVd3t2XfDutMgVFPeShG3RiPGGrSa1qJ5b5f23sHyFAd2nrqU2",
      StartTstampSecs: null,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result?.data?.PostsFound?.map((post) => post.PostHashHex);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async transferNft(publicKey, postHashHex) {
    const path = "/v0/transfer-nft";
    const data = {
      MinFeeRateNanosPerKB: 1000,
      NFTPostHashHex: postHashHex,
      ReceiverPublicKeyBase58Check:
        "BC1YLh9EQ1Lv38dswCDvxSFEEMHH7LKv2jocWwHTcvUx5ck4zuTVhGF",
      SenderPublicKeyBase58Check: publicKey,
      SerialNumber: 1,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getNotifications(publicKey) {
    const path = "/v0/get-notifications";
    const data = {
      PublicKeyBase58Check: publicKey,
      FetchStartIndex: -1,
      NumToFetch: 50,
      FilteredOutNotificationCategories: {},
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async submitTransaction(signedTransactionHex) {
    if (!signedTransactionHex) {
      console.log("signedTransactionHex is required");
      return;
    }

    const path = "/v0/submit-transaction";
    const data = {
      TransactionHex: signedTransactionHex,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUsersStateless(publicKeyList, s, g) {
    const path = "/v0/get-users-stateless";
    const data = {
      PublicKeysBase58Check: publicKeyList,
      SkipForLeaderboard: s,
      GetUnminedBalance: g,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getProfilesPartialMatch(partialName) {
    if (!partialName) {
      console.log("partialName is required");
      return;
    }

    const path = "/v0/get-profiles";
    const data = {
      ReaderPublicKeyBase58Check: "",
      UsernamePrefix: partialName,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getExchangeRate() {
    const path = "/v0/get-exchange-rate";
    try {
      const result = await this.getClient().get(path);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // async getUsersStateless(PublicKeysBase58Check) {
  //   const path = "/v0/get-users-stateless";
  //   const data = {
  //     PublicKeysBase58Check: PublicKeysBase58Check,
  //   };
  //   try {
  //     const result = await this.getClient().post(path, data);
  //     return result.data;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }

  getClient() {
    if (client) return client;
    client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return client;
  }
}

export default DesoApi;
