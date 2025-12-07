module.exports.getReviewsInfo = (arr) => {

    const reviewsArray = arr || [];
    
    const rating = "No rating"

    if(reviewsArray.length){
        rating = reviewsArray.reduce((sum, review) => sum + review.rating , 0) / reviewsArray.length;
    }

    return rating;
}