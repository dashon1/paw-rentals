import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle, Eye, Calendar, Home } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ApplicationsPage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userInstance = await base44.auth.me().catch(() => null);
    setUser(userInstance);
  };

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', user?.email],
    queryFn: () => base44.entities.Application.filter(
      { applicant_email: user.email },
      '-created_date'
    ),
    enabled: !!user?.email
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => base44.entities.Property.list(),
    enabled: applications.length > 0
  });

  const getProperty = (propertyId) => {
    return properties.find(p => p.id === propertyId);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view applications</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-orange-500" />
            My Applications
          </h1>
          <p className="text-gray-600 mt-2">
            Track your rental applications
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : applications.length === 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Applications Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start browsing properties and submit applications to find your perfect home!
              </p>
              <Link to={createPageUrl("Search")}>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Browse Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => {
              const property = getProperty(application.property_id);
              
              return (
                <Card key={application.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* Property Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Home className="w-10 h-10 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {property?.title || 'Property'}
                            </h3>
                            {property && (
                              <p className="text-gray-600 text-sm mb-2">
                                {property.address}, {property.city}, {property.state}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status.replace(/_/g, ' ')}
                              </Badge>
                              {application.submitted_date && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  Submitted {format(new Date(application.submitted_date), 'MMM d, yyyy')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Application Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-orange-50 rounded-lg">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Move-in Date</p>
                            <p className="font-medium text-sm">
                              {application.move_in_date 
                                ? format(new Date(application.move_in_date), 'MMM d, yyyy')
                                : 'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Pets</p>
                            <p className="font-medium text-sm">
                              {application.pets?.length || 0} pet(s)
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Employment</p>
                            <p className="font-medium text-sm">
                              {application.employment?.employer || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Background Check</p>
                            <p className="font-medium text-sm capitalize">
                              {application.background_check_status?.replace(/_/g, ' ')}
                            </p>
                          </div>
                        </div>

                        {application.landlord_notes && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                              Landlord Notes:
                            </p>
                            <p className="text-sm text-gray-700">
                              {application.landlord_notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status Icon & Actions */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(application.status)}
                        </div>
                        <Link to={createPageUrl(`PropertyDetails?id=${application.property_id}`)}>
                          <Button variant="outline" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            View Property
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}