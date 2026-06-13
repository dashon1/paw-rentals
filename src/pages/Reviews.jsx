import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown, Calendar, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function ReviewsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('property_id');
  
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => base44.entities.Review.filter({ property_id: propertyId }, '-created_date'),
    enabled: !!propertyId
  });

  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const props = await base44.entities.Property.filter({ id: propertyId });
      return props[0];
    },
    enabled: !!propertyId
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingBreakdown = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  if (!propertyId) {
    return <div className="p-8">Property ID required</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reviews for {property?.title}
          </h1>
          <p className="text-gray-600">Read reviews from other pet owners</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg border-0 sticky top-6">
              <CardHeader>
                <CardTitle>Overall Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-orange-500 mb-2">
                    {averageRating}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(averageRating)
                            ? 'fill-orange-500 text-orange-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{reviews.length} reviews</p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${reviews.length > 0 ? (ratingBreakdown[rating] / reviews.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {ratingBreakdown[rating]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              </div>
            ) : reviews.length === 0 ? (
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600">
                    Be the first to review this property!
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.reviewer_name?.[0] || 'R'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.reviewer_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(review.created_date), 'MMM d, yyyy')}
                              {review.verified_renter && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                    )}

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {review.comment}
                    </p>

                    {review.ratings_breakdown && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 p-4 bg-orange-50 rounded-lg">
                        {Object.entries(review.ratings_breakdown).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <div className="text-gray-600 capitalize mb-1">
                              {key.replace(/_/g, ' ')}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < value
                                      ? 'fill-orange-500 text-orange-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {(review.pros?.length > 0 || review.cons?.length > 0) && (
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {review.pros?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsUp className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-600">Pros</span>
                            </div>
                            <ul className="space-y-1">
                              {review.pros.map((pro, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-green-600">+</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsDown className="w-4 h-4 text-red-600" />
                              <span className="font-medium text-red-600">Cons</span>
                            </div>
                            <ul className="space-y-1">
                              {review.cons.map((con, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-red-600">-</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {review.would_recommend !== undefined && (
                      <div className="pt-4 border-t">
                        <p className="text-sm">
                          <span className="font-medium">Would recommend: </span>
                          <span className={review.would_recommend ? 'text-green-600' : 'text-red-600'}>
                            {review.would_recommend ? 'Yes ✓' : 'No ✗'}
                          </span>
                        </p>
                      </div>
                    )}

                    {review.landlord_response && (
                      <div className="mt-4 pt-4 border-t bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-lg">
                        <p className="font-medium text-sm mb-2">Response from Landlord:</p>
                        <p className="text-gray-700 text-sm">{review.landlord_response}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {format(new Date(review.landlord_response_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}