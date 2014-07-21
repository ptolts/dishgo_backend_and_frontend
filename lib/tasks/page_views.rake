task :page_views => :environment do
	PageViewHour.new.build
	PageViewDay.new.build	
end