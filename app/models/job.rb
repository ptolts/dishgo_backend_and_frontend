class Job
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic
  store_in collection: "delayed_backend_mongoid_jobs", database: "dishgo"

end
