export namespace GoogleApiYoutube {
  interface GApiYoutubeClient {
    videos: GApiYoutubeVideos
    search: GApiYoutubeSearch
  }

  interface GApiYoutubeVideos {
    rate: (
      options: GApiYoutubeVideosRateParams
    ) => Promise<void>
  }

  interface GApiYoutubeSearch {
    list: (
      options: GApiYoutubeSearchListParams
    ) => Promise<GApiYoutubeResponse.GApiYoutubeVideosListResponse>
  }

  interface GApiYoutubeVideosRateParams {
    /** @example 'tscL_I2v7pU' */
    id: string
    rating: 'none' | 'like' | 'dislike'
  }

  interface GApiYoutubeSearchListParams {
    /**
     * Comma-separated list of one or more search resource properties
     * that the API response will include
     * @example ['snippet']
     * */
    part: string[]

    /**
     * Restricts the search to only retrieve videos owned by
     * the content owner identified by the `onBehalfOfContentOwner` parameter
     * */
    forContentOwner?: boolean

    /**
     * Restricts the search to only retrieve videos uploaded via
     * the developer's application or website
     * */
    forDeveloper?: boolean

    /**
     * Restricts the search to only retrieve videos owned by
     * the authenticated user
     * */
    forMine?: boolean

    /**
     * Retrieves a list of videos that are related to the video
     * that the parameter value identifies. The parameter value
     * must be set to a YouTube video ID and, if you are using
     * this parameter, the type parameter must be set to video
     * */
    relatedToVideoId?: boolean

    /**
     * Indicates that the API response should only contain
     * resources created by the channel
     * */
    channelId?: string

    /**
     * Restrict a search to a particular type of channel
     * * any – Return all channels
     * * show – Only retrieve shows
     * */
    channelType?: 'any' | 'show'

    /**
     * Restricts a search to broadcast events. If you specify
     * a value for this parameter, you must also set the
     * type parameter's value to video
     * * 'completed' – Only include completed broadcasts
     * * 'live' – Only include active broadcasts
     * * 'upcoming' – Only include upcoming broadcasts
     * */
    eventType?: 'completed' | 'live' | 'upcoming'

    /**
     * In conjunction with the locationRadius parameter,
     * defines a circular geographic area and also
     * restricts a search to videos that specify,
     * in their metadata, a geographic location
     * that falls within that area.
     * The parameter value is a string that
     * specifies latitude/longitude coordinates
     * @example '(37.42307,-122.08427)'.
     * */
    location?: string

    /**
     * In conjunction with the location parameter, defines a
     * circular geographic area.
     * The parameter value must be a floating point number
     * followed by a measurement unit. Valid measurement
     * units are m, km, ft, and mi.
     * The API does not support locationRadius
     * parameter values larger than 1000 kilometers
     * @example '1500m'
     * @example '5km'
     * @example '10000ft'
     * @example '0.75mi'
     * */
    locationRadius?: string

    /**
     * Specifies the maximum number
     * of items that should be returned in the result set.
     * Acceptable values are 0 to 50, inclusive
     * @default 5
     * */
    maxResults?: string

    /**
     * Indicates that the request's authorization credentials identify
     * a YouTube CMS user who is acting on behalf of
     * the content owner specified in the parameter value
     */
    onBehalfOfContentOwner?: string

    /**
     * Specifies the method that will be used to
     * order resources in the API response.
     * * date – Resources are sorted in reverse chronological order based on the date they were created
     * * rating – Resources are sorted from highest to lowest rating
     * * relevance – Resources are sorted based on their relevance to the search query. This is the default value for this parameter
     * * title – Resources are sorted alphabetically by title
     * @default 'relevance'
     */
    order?:
      | 'date'
      | 'rating'
      | 'relevance'
      | 'title'
      | 'videoCount'
      | 'viewCount'

    /**
     * Identifies a specific page in the result set that
     * should be returned. In an API response, the nextPageToken
     * and prevPageToken properties identify other pages
     * that could be retrieved
     * */
    pageToken?: string
    publishedAfter?: string
    publishedBefore?: string

    /**
     * The q parameter specifies the query term to search for.
     * Your request can also use the Boolean NOT (-) and OR (|) operators to exclude videos
     * or to find videos that are associated with one of several search terms.
     * For example, to search for videos matching either "boating" or "sailing",
     * set the q parameter value to boating|sailing. Similarly, to search for videos
     * matching either "boating" or "sailing" but not "fishing", set the q parameter value
     * to boating|sailing -fishing.
     * */
    q?: string
    regionCode?: string
    relevanceLanguage?: string
    safeSearch?: 'moderate' | 'none' | 'strict'
    topicId?: string
    type?: 'channel' | 'video' | 'playlist'
    videoCaption?: 'any' | 'closedCaption' | 'none'

    /** @example '10' */
    videoCategoryId?: string
    videoDefinition?: 'any' | 'high' | 'standard'
    videoDimension?: '2d' | '3d' | 'any'
    videoDuration?: 'any' | 'long' | 'medium' | 'short'
    videoEmbeddable?: 'any' | 'true'
    videoLicense?: 'any' | 'creativeCommon' | 'youtube'
    videoSyndicated?: 'any' | 'true'
    videoType?: 'any' | 'episode' | 'movie'
  }
}

export namespace GApiYoutubeResponse {
  interface GApiYoutubeVideosListResponse {
    result: GApiYoutubeVideosList
  }

  interface GApiYoutubeVideosList {
    kind: string
    etag: string
    nextPageToken: string
    prevPageToken: string
    regionCode: string
    pageInfo: GApiPageInfo
    items: GApiYoutubeResource[]
  }

  interface GApiPageInfo {
    totalResults: number
    resultsPerPage: number
  }

  interface GApiYoutubeResource {
    /** @example 'youtube#searchResult' */
    kind: string
    etag: string
    id: GApiYoutubeResourceId
    snippet: GApiYoutubeResourceSnippet
  }

  interface GApiYoutubeResourceId {
    kind?: string
    videoId?: string
    channelId?: string
    playlistId?: string
  }

  interface GApiYoutubeResourceSnippet {
    /**
     * ISO 8601 format
     * @see https://www.w3.org/TR/NOTE-datetime
     * */
    publishedAt: string

    channelId: string
    title: string
    description: string
    thumbnails: GApiYoutubeResourceThumbnails
    channelTitle: string
    liveBroadcastContent: 'upcoming' | 'live' | 'none'
  }

  interface GApiYoutubeResourceThumbnails {
    default?: GApiYoutubeResourceThumbnail
    medium?: GApiYoutubeResourceThumbnail
    high?: GApiYoutubeResourceThumbnail
    standard?: GApiYoutubeResourceThumbnail
    maxres?: GApiYoutubeResourceThumbnail
  }

  interface GApiYoutubeResourceThumbnail {
    url: string
    width: number
    height: number
  }
}
