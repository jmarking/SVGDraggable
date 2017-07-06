using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.FileProviders;

namespace SVGDraggable
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            var defaultFileOptions = new DefaultFilesOptions()
            {
                RequestPath = "",
                FileProvider = new PhysicalFileProvider(env.ContentRootPath)
            };
            app.UseDefaultFiles(defaultFileOptions);
            var staticFileOptions = new StaticFileOptions()
            {
                RequestPath = "",
                FileProvider = new PhysicalFileProvider(env.ContentRootPath)
            };
            app.UseStaticFiles(staticFileOptions);
        }
    }
}
